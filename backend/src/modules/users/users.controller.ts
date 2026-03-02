import { Controller, Get, Put, Patch, Param, Body, Query, UseGuards, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('Users') @ApiBearerAuth('JWT-auth') @UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return { message: 'Perfil obtenido', data: await this.usersService.findById(user._id) };
  }

  @Put('profile')
  async updateProfile(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    return { message: 'Perfil actualizado', data: await this.usersService.updateProfile(user._id.toString(), dto) };
  }

  @Get('stats') @UseGuards(RolesGuard) @Roles('admin')
  async getStats() { return { message: 'Stats', data: await this.usersService.getStats() }; }

  @Get() @UseGuards(RolesGuard) @Roles('admin')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) { return { message: 'Usuarios', data: await this.usersService.findAll(page, limit, search) }; }

  @Patch(':id/role') @UseGuards(RolesGuard) @Roles('admin')
  async updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return { message: 'Rol actualizado', data: await this.usersService.updateRole(id, dto.role) };
  }

  @Patch(':id/toggle-active') @UseGuards(RolesGuard) @Roles('admin')
  async toggleActive(@Param('id') id: string) {
    return { message: 'Estado actualizado', data: await this.usersService.toggleActive(id) };
  }
}