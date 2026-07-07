import {
  Controller,
  ForbiddenException,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import 'multer';
import { DocumentsService } from './documents.service';

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

  @Get('/get-all')
  getAllDocuments(@Session() session: UserSession) {
    const orgId = session.session.activeOrganizationId;
    if (!orgId) throw new ForbiddenException();
    return this.documentsService.getAllDocuments(orgId);
  }
}
