import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService, private config: ConfigService) {}

  async register(dto: RegisterDto) {
    if (await this.usersService.findByEmail(dto.email)) throw new ConflictException('Email ya registrado');
    const password = await bcrypt.hash(dto.password, 12);
    const user = await this.usersService.create({ ...dto, password });
    const tokens = await this.generateTokens(user);
    await this.usersService.saveRefreshToken(user._id.toString(), tokens.refreshToken);
    return { user: this.sanitize(user), ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !user.isActive) throw new UnauthorizedException('Credenciales inválidas');
    if (!await bcrypt.compare(dto.password, user.password)) throw new UnauthorizedException('Credenciales inválidas');
    const tokens = await this.generateTokens(user);
    await this.usersService.saveRefreshToken(user._id.toString(), tokens.refreshToken);
    return { user: this.sanitize(user), ...tokens };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: this.config.get('JWT_REFRESH_SECRET') });
      const user = await this.usersService.findById(payload.sub);
      if (!user) throw new UnauthorizedException();
      const tokens = await this.generateTokens(user);
      await this.usersService.saveRefreshToken(user._id.toString(), tokens.refreshToken);
      return tokens;
    } catch { throw new UnauthorizedException('Refresh token inválido'); }
  }

  async logout(userId: string) { await this.usersService.saveRefreshToken(userId, null); }

  private async generateTokens(user: any) {
    const payload = { sub: user._id.toString(), email: user.email, role: user.role, name: user.name };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { secret: this.config.get('JWT_SECRET'), expiresIn: this.config.get('JWT_EXPIRES_IN') }),
      this.jwtService.signAsync(payload, { secret: this.config.get('JWT_REFRESH_SECRET'), expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN') }),
    ]);
    return { accessToken, refreshToken };
  }

  private sanitize(user: any) {
    const u = user.toObject ? user.toObject() : { ...user };
    delete u.password; delete u.refreshToken;
    return u;
  }
}
