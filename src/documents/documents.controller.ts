import {
  Controller,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';
import { DocumentsService } from './documents.service';
import { AuthGuard } from '@thallesp/nestjs-better-auth';

// @UseGuards(AuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('/upload/:id/file')
  @UseInterceptors(FileInterceptor('file'))
  uploadDocument(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 })],
      }),
    )
    file: Express.Multer.File,
  ) {

    return this.documentsService.uploadDocument({
      file,
      organizationId: id,
    });
  }

  @Get('/get-all/:id')
  getAllDocuments(@Param('id') id: string) {
    return this.documentsService.getAllDocuments(id);
  }
}
