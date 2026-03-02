import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  AUTOR = 'autor',
  LECTOR = 'lector',
}

export class UpdateRoleDto {
  @ApiProperty({
    description: 'Nuevo rol a asignar al usuario',
    enum: UserRole,
    example: UserRole.AUTOR,
  })
  @IsEnum(UserRole, { message: `El rol debe ser uno de: ${Object.values(UserRole).join(', ')}` })
  @IsNotEmpty({ message: 'El rol es obligatorio' })
  role: UserRole;
}
