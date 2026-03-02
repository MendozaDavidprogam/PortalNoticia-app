import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  Controller, Post, Delete, Param, UseGuards,
  UseInterceptors, UploadedFile, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CloudinaryService } from './cloudinary.service';

@ApiTags('Upload') @ApiBearerAuth('JWT-auth') @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('image') @Roles('autor', 'admin')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No se proporcionó imagen válida');

    const result = await this.cloudinaryService.uploadImage(file);

    return {
      message: 'Imagen subida',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    };
  }

  @Delete(':publicId') @Roles('autor', 'admin')
  async deleteImage(@Param('publicId') publicId: string) {

    await this.cloudinaryService.deleteImage(decodeURIComponent(publicId));
    return { message: 'Imagen eliminada', data: null };
  }
}

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
      fileFilter: (_req, file, cb) =>
        cb(null, /\.(jpg|jpeg|png|gif|webp)$/i.test(file.originalname)),
      limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') },
    }),
  ],
  controllers: [UploadController],
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class UploadModule {}