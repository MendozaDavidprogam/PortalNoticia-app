import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'Nuevo contenido del comentario',
    example: 'Actualizo mi comentario: muy buena noticia.',
    minLength: 1,
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty({ message: 'El contenido del comentario es obligatorio' })
  @MinLength(1, { message: 'El comentario no puede estar vacío' })
  @MaxLength(1000, { message: 'El comentario no puede superar los 1000 caracteres' })
  content: string;
}
