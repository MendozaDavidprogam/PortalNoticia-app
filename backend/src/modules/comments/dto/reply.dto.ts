import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ReplyDto {
  @ApiProperty({
    description: 'Contenido de la respuesta al comentario',
    example: 'Totalmente de acuerdo contigo.',
    minLength: 1,
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty({ message: 'El contenido de la respuesta es obligatorio' })
  @MinLength(1, { message: 'La respuesta no puede estar vacía' })
  @MaxLength(500, { message: 'La respuesta no puede superar los 500 caracteres' })
  content: string;
}
