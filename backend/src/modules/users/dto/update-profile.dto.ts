import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength, Matches } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'Nombre completo del usuario',
    example: 'María González',
    minLength: 2,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede superar los 100 caracteres' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Biografía o descripción del usuario',
    example: 'Periodista especializada en medio ambiente y tecnología.',
    maxLength: 300,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300, { message: 'La biografía no puede superar los 300 caracteres' })
  bio?: string;

  @ApiPropertyOptional({
    description: 'URL del avatar del usuario',
    example: '/uploads/avatar-abc123.jpg',
  })
  @IsOptional()
  @IsString()
  avatar?: string;
}
