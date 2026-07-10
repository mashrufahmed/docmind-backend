import {
  BadRequestException,
  Injectable,
  MessageEvent as MEvent,
  NotFoundException,
} from '@nestjs/common';
import { Job as J } from 'bullmq';
import { Response } from 'express';
import * as https from 'https';
import path from 'path';
import { Subject } from 'rxjs';
import { AiService } from 'src/ai/ai.service';
import { FileService } from 'src/common/file/file.service';
import { FileStatus } from 'src/common/prisma/generated/prisma/enums';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { JobData, QueueService } from 'src/common/queue/queue.service';
import { ParserFactory } from './parsers/parser.factory';
@Injectable()
export class DocumentsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileService,
    private readonly queueService: QueueService,
    private readonly parserFactory: ParserFactory,
    private readonly aiService: AiService,
  ) {}
  private subjects = new Map<string, Subject<MEvent>>();

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
      const data = await this.prismaService.file.create({
        data: {
          url: uploadedFile.secure_url,
          publicId: uploadedFile.public_id,
          identifier: organizationId,
          fileName: file.originalname,
          fileType,
          status: 'UPLOADED',
          mimeType: file.mimetype,
          fileSize: file.size,
        },
      });

      await this.queueService.processFile({ documentId: data.id });
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

  async viewDocument(id: string, res: Response) {
    const document = await this.prismaService.file.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    https.get(document.url, (cloudinaryRes) => {
      res.setHeader(
        'Content-Type',
        cloudinaryRes.headers['content-type'] || 'application/octet-stream',
      );
      res.setHeader('Content-Disposition', 'inline');
      cloudinaryRes.pipe(res);
    });
  }

  subscribe(documentId: string) {
    if (!this.subjects.has(documentId)) {
      this.subjects.set(documentId, new Subject<MEvent>());
    }

    return this.subjects.get(documentId)!.asObservable();
  }

  emit(documentId: string, data: any) {
    this.subjects.get(documentId)?.next({
      data: data,
    });
  }

  async processDocument(data: J<JobData>) {
    const id = data.data.documentId as string;
    const file = await this.prismaService.file.findFirst({
      where: {
        id: id,
      },
    });
    await this.prismaService.file.update({
      where: {
        id: file?.id,
      },
      data: {
        status: FileStatus.PROCESSING,
      },
    });

    const response = await fetch(file?.url as string);
    if (!response.ok) {
      throw new Error('Failed to download document');
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    const parser = this.parserFactory.get(file?.mimeType as string);
    const text = await parser.parse(buffer);
    if (!text.trim()) {
      throw new BadRequestException('Document contains no readable text');
    }
    return await this.aiService.processForLLM(text, file?.id as string);
  }
}
