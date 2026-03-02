import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'ID de la noticia a la que pertenece el comentario',
    example: '64f1a2b3c4d5e6f7a8b9c0d1',
  })
  @IsMongoId({ message: 'newsId debe ser un ID de MongoDB válido' })
  @IsNotEmpty({ message: 'El ID de la noticia es obligatorio' })
  newsId: string;

  @ApiProperty({
    description: 'Contenido del comentario',
    example: 'Muy interesante la noticia, gracias por compartir.',
    minLength: 1,
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty({ message: 'El contenido del comentario es obligatorio' })
  @MinLength(1, { message: 'El comentario no puede estar vacío' })
  @MaxLength(1000, { message: 'El comentario no puede superar los 1000 caracteres' })
  content: string;
}
