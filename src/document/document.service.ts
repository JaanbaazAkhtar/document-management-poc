import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../entities/document.entity';
import { ClientProxy } from '@nestjs/microservices';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { UsersService } from '../user/user.service'; // Import UsersService

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document) private documentsRepository: Repository<Document>,
    @Inject('INGESTION_SERVICE') private client: ClientProxy,
    private usersService: UsersService, // Inject UsersService
  ) {}

  async create(createDocumentDto: CreateDocumentDto, userId: number): Promise<Document> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const document = this.documentsRepository.create({
      ...createDocumentDto,
      uploadedBy: user,
      ingestionStatus: 'pending',
    });
    return this.documentsRepository.save(document);
  }

  async findAll(): Promise<Document[]> {
    return this.documentsRepository.find({ relations: ['uploadedBy'] });
  }

  async findOne(id: number): Promise<Document> {
    const document = await this.documentsRepository.findOne({ where: { id }, relations: ['uploadedBy'] });
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return document;
  }

  async update(id: number, updateDocumentDto: UpdateDocumentDto): Promise<Document> {
    await this.documentsRepository.update(id, updateDocumentDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const document = await this.findOne(id);
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    await this.documentsRepository.delete(id);
  }

  async triggerIngestion(documentId: number): Promise<void> {
    const document = await this.findOne(documentId);
    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }
    this.client.emit('ingest_document', { documentId: document.id, filePath: document.filePath });
    await this.update(documentId, { ingestionStatus: 'processing' });
  }

  async updateIngestionStatus(documentId: number, status: string): Promise<Document> {
    return this.update(documentId, { ingestionStatus: status });
  }
}