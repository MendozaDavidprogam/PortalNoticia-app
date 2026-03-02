import { Controller, Get, Patch, Delete, Param, UseGuards, Query, DefaultValuePipe, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Notifications') @ApiBearerAuth('JWT-auth') @UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getAll(
    @CurrentUser() user: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(30), ParseIntPipe) limit: number,
  ) { return { message: 'Notificaciones', data: await this.notificationsService.getMyNotifications(user._id.toString(), page, limit) }; }

  @Get('unread-count')
  async unreadCount(@CurrentUser() user: any) {
    return { message: 'Conteo', data: { count: await this.notificationsService.countUnread(user._id.toString()) } };
  }

  @Patch('read-all')
  async markAllAsRead(@CurrentUser() user: any) {
    await this.notificationsService.markAllAsRead(user._id.toString());
    return { message: 'Todas leídas', data: null };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @CurrentUser() user: any) {
    return { message: 'Leída', data: await this.notificationsService.markAsRead(id, user._id.toString()) };
  }

  @Delete(':id') @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    await this.notificationsService.deleteNotification(id, user._id.toString());
    return { message: 'Eliminada', data: null };
  }
}
