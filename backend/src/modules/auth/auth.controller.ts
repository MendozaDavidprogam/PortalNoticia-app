import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UsersService } from '../users/users.service';
//import * as bcrypt from 'bcryptjs';
//import { CreateAdminDto } from './dto/create-admin.dto';

class RefreshDto { @IsString() refreshToken: string; }

@ApiTags('Auth') @Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
        private readonly usersService: UsersService,
  )
   {}

  @Public() @Post('register')
  async register(@Body() dto: RegisterDto) { return { message: 'Registro exitoso', data: await this.authService.register(dto) }; }

  @Public() @Post('login')
  async login(@Body() dto: LoginDto) { return { message: 'Login exitoso', data: await this.authService.login(dto) }; }

  @Public() @Post('refresh')
  async refresh(@Body() dto: RefreshDto) { return { message: 'Token renovado', data: await this.authService.refresh(dto.refreshToken) }; }

  @UseGuards(JwtAuthGuard) @Post('logout')
  async logout(@CurrentUser() user: any) {
    await this.authService.logout(user._id.toString());
    return { message: 'Logout exitoso', data: null };
  }

  /*@Public() @Post('create-admin')
  async createAdmin(@Body() body: CreateAdminDto) {
    if (body.secret !== process.env.ADMIN_SEED_SECRET) {
      return { message: 'No autorizado', data: null };
    }

    const existing = await this.usersService.findByEmail(body.email);
    if (existing) return { message: 'El usuario ya existe', data: null };

    const password = await bcrypt.hash(body.password, 12);
    const user = await this.usersService.create({
      name: body.name,
      email: body.email,
      password,
      role: 'admin' as any,
      isActive: true,
    });

    return {
      message: 'Admin creado exitosamente',
      data: { _id: user._id, name: user.name, email: user.email, role: user.role },
    };
  }*/
}
