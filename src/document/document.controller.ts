import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { DocumentsService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';
import { Multer } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiTags('documents')
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'The document has been successfully uploaded.' })
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

  @Post(':id/trigger-ingestion')
  @Roles('admin')
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiOkResponse({ description: 'Ingestion triggered successfully.' })
  async triggerIngestion(@Param('id') id: string) {
    return this.documentsService.triggerIngestion(+id);
  }

  @Get()
  @ApiOkResponse({ description: 'List of all documents.' })
  findAll() {
    return this.documentsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'A single document.' })
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('editor', 'admin')
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiBody({ type: UpdateDocumentDto })
  @ApiOkResponse({ description: 'Document updated successfully.' })
  update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentsService.update(+id, updateDocumentDto);
  }

  @Delete(':id')
  @Roles('editor', 'admin')
  @Roles('editor', 'admin')
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiOkResponse({ description: 'Document deleted successfully.' })
  remove(@Param('id') id: string) {
    return this.documentsService.remove(+id);
  }
}