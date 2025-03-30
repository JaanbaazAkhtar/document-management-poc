import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { DocumentsService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage, Multer } from 'multer'

@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @Roles('editor', 'admin')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `${file.originalname.replace(ext, '')}-${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (file.mimetype.match(/\/(pdf|doc|docx|txt)$/)) {
        callback(null, true);
      } else {
        callback(new HttpException('Unsupported file type', HttpStatus.BAD_REQUEST), false);
      }
    },
  }))
  async uploadFile(@UploadedFile() file: Multer.File, @Req() req) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }
    const createDocumentDto: CreateDocumentDto = {
      title: file.originalname,
      filePath: file.path,
    };
    return this.documentsService.create(createDocumentDto, req.user.id);
  }

  @Get()
  @Roles('viewer', 'editor', 'admin')
  findAll() {
    return this.documentsService.findAll();
  }

  @Get(':id')
  @Roles('viewer', 'editor', 'admin')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('editor', 'admin')
  update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentsService.update(+id, updateDocumentDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.documentsService.remove(+id);
  }

  @Post(':id/ingest')
  @Roles('editor', 'admin')
  async triggerIngestion(@Param('id') id: string) {
    await this.documentsService.triggerIngestion(+id);
    return { message: 'Ingestion triggered' };
  }

  @Patch(':id/ingestion-status')
  @Roles('admin')
  async updateIngestionStatus(@Param('id') id: string, @Body() { status }: { status: string }) {
    await this.documentsService.updateIngestionStatus(+id, status);
    return { message: 'Ingestion status updated' };
  }
}