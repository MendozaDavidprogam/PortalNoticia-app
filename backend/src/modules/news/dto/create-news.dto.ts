import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum NewsStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export class CreateNewsDto {
  @ApiProperty({
    description: 'Título de la noticia',
    example: 'El cambio climático afecta a millones de personas',
    minLength: 5,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @MinLength(5, { message: 'El título debe tener al menos 5 caracteres' })
  @MaxLength(200, { message: 'El título no puede superar los 200 caracteres' })
  title: string;

  @ApiProperty({
    description: 'Contenido completo de la noticia',
    example: 'Según un nuevo informe publicado hoy, el cambio climático...',
    minLength: 20,
  })
  @IsString()
  @IsNotEmpty({ message: 'El contenido es obligatorio' })
  @MinLength(20, { message: 'El contenido debe tener al menos 20 caracteres' })
  content: string;

  @ApiPropertyOptional({
    description: 'URL de la imagen principal de la noticia',
    example: '/uploads/abc123.jpg',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    description: 'Etiquetas para clasificar la noticia',
    example: ['clima', 'medioambiente', 'ciencia'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Las etiquetas deben ser un arreglo' })
  @IsString({ each: true, message: 'Cada etiqueta debe ser un texto' })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Estado de publicación de la noticia',
    enum: NewsStatus,
    default: NewsStatus.PUBLISHED,
  })
  @IsOptional()
  @IsEnum(NewsStatus, { message: `El estado debe ser: ${Object.values(NewsStatus).join(', ')}` })
  status?: NewsStatus;
}
