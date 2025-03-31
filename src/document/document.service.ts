import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { UsersService } from '../user/user.service';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private usersService: UsersService,
    @Inject('INGESTION_SERVICE') private client: ClientProxy,
  ) {}

  async create(createDocumentDto: CreateDocumentDto, userId: number): Promise<Document> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const document = this.documentRepository.create({
      ...createDocumentDto,
      uploadedBy: user,
      ingestionStatus: 'pending',
    });
    return this.documentRepository.save(document);
  }

  async findAll(): Promise<Document[]> {
    return this.documentRepository.find();
  }

  async findOne(id: number): Promise<Document | undefined> {
    const document = await this.documentRepository.findOne({ where: { id }, relations: ['uploadedBy'] });
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return document;
  }

  async update(id: number, updateDocumentDto: UpdateDocumentDto): Promise<Document> {
    const document = await this.findOne(id);
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    await this.documentRepository.update(id, updateDocumentDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const document = await this.findOne(id);
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    await this.documentRepository.delete(id);
  }

  async triggerIngestion(id: number) {
    const document = await this.findOne(id);
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    this.client.emit('ingestion_trigger', { documentId: id });
    await this.documentRepository.update(id, { ingestionStatus: 'processing' });
    return this.findOne(id);
  }

  async updateIngestionStatus(documentId: number, status: string, message?: string): Promise<Document> {
    const document = await this.documentRepository.findOne({ where: { id: documentId } });
    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }
    await this.documentRepository.update(documentId, { ingestionStatus: status, ingestionMessage: message });
    return this.findOne(documentId);
  }
}