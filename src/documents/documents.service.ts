import { Injectable } from '@nestjs/common';
import { AuthService } from '@thallesp/nestjs-better-auth';
import path from 'path';
import { FileService } from 'src/common/file/file.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
@Injectable()
export class DocumentsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileService,
    private readonly authService: AuthService,
  ) {}

  async uploadDocument({
    file,
    organizationId,
  }: {
    file: Express.Multer.File;
    organizationId: string;
  }) {
    const uploadedFile = await this.fileService.uploadFile(file);
    const fileType =
      path.extname(file.originalname).replace('.', '').toLowerCase() ||
      'unknown';

    if (uploadedFile) {
      await this.prismaService.file.create({
        data: {
          url: uploadedFile.secure_url,
          publicId: uploadedFile.public_id,
          identifier: organizationId,
          fileName: file.originalname,
          fileType,
          mimeType: file.mimetype,
          fileSize: file.size,
        },
      });
    }
    return {
      url: uploadedFile.secure_url,
    };
  }

  async getAllDocuments(organizationId: string) {
    return await this.prismaService.file.findMany({
      where: {
        identifier: organizationId,
      },
    });
  }
}
