import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({
  cors: { origin: ['http://localhost:5173', 'http://localhost:3001'], credentials: true },
})
export class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(NotificationsGateway.name);
  private userSockets = new Map<string, Set<string>>();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private notificationsService: NotificationsService,
  ) {}

  onModuleInit() { this.notificationsService.setGateway(this); }
  afterInit() { this.logger.log('WebSocket Gateway iniciado'); }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');
      if (!token) { client.disconnect(); return; }

      const payload = await this.jwtService.verifyAsync(token, { secret: this.configService.get('JWT_SECRET') });
      client.data.userId = payload.sub;
      client.data.userName = payload.name;

      if (!this.userSockets.has(payload.sub)) this.userSockets.set(payload.sub, new Set());
      this.userSockets.get(payload.sub)?.add(client.id);
      client.join(`user:${payload.sub}`);

      this.logger.log(`${payload.name} conectado (${client.id})`);

      const unread = await this.notificationsService.countUnread(payload.sub);
      client.emit('unread-count', { count: unread });
    } catch { client.disconnect(); }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.userId;
    if (userId) {
      const sockets = this.userSockets.get(userId);
      if (sockets) { sockets.delete(client.id); if (!sockets.size) this.userSockets.delete(userId); }
    }
    this.logger.log(`Socket ${client.id} desconectado`);
  }

  notifyUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }
}