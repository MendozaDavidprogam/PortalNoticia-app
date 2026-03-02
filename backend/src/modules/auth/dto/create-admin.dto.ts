import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'Admin Principal' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'admin@admin.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Admin1234' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'tu-clave-secreta-del-env', description: 'Debe coincidir con ADMIN_SEED_SECRET del .env' })
  @IsString()
  secret: string;
}
