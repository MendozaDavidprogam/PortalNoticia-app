import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { NewsStatus } from './create-news.dto';

export class UpdateNewsDto {
  @ApiPropertyOptional({
    description: 'Título de la noticia',
    example: 'Nuevo título corregido',
    minLength: 5,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'El título debe tener al menos 5 caracteres' })
  @MaxLength(200, { message: 'El título no puede superar los 200 caracteres' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Contenido de la noticia',
    example: 'Contenido actualizado de la noticia...',
    minLength: 20,
  })
  @IsOptional()
  @IsString()
  @MinLength(20, { message: 'El contenido debe tener al menos 20 caracteres' })
  content?: string;

  @ApiPropertyOptional({
    description: 'URL de la imagen principal',
    example: '/uploads/nueva-imagen.jpg',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    description: 'Etiquetas de la noticia',
    example: ['política', 'economía'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Las etiquetas deben ser un arreglo' })
  @IsString({ each: true, message: 'Cada etiqueta debe ser un texto' })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Estado de publicación',
    enum: NewsStatus,
  })
  @IsOptional()
  @IsEnum(NewsStatus, { message: `El estado debe ser: ${Object.values(NewsStatus).join(', ')}` })
  status?: NewsStatus;
}
