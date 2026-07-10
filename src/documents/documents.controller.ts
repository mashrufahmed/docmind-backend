import {
  Controller,
  ForbiddenException,
  Get,
  MaxFileSizeValidator,
  MessageEvent,
  Param,
  ParseFilePipe,
  Post,
  Res,
  Sse,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import type { Response } from 'express';
import 'multer';
import { Observable } from 'rxjs';
import { DocumentsService } from './documents.service';

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

  @Get('view/:id')
  viewDocument(@Param('id') id: string, @Res() response: Response) {
    return this.documentsService.viewDocument(id, response);
  }

  @Sse(':id/events')
  events(@Param('id') id: string): Observable<MessageEvent> {
    return this.documentsService.subscribe(id);
  }
}
