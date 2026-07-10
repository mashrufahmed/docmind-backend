import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import { ALLOWED_FILE_TYPES } from '../constants';

@Injectable()
export class FileService {
  private readonly cloudinary = cloudinary;
  constructor(configService: ConfigService) {
    this.cloudinary.config({
      cloud_name: configService.getOrThrow('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.getOrThrow('CLOUDINARY_API_KEY'),
      api_secret: configService.getOrThrow('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(file: Express.Multer.File) {
    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Unsupported file type.');
    }
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!);
        },
      );

      Readable.from(file.buffer).pipe(stream);
    });
  }

  async removeFile(publicId: string) {
    return await this.cloudinary.uploader.destroy(publicId);
  }
}
