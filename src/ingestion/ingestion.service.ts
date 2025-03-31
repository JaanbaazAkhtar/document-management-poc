import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IngestionStatus } from '../entities/ingestion.entity';

@Injectable()
export class IngestionStatusService {
  constructor(
    @InjectRepository(IngestionStatus)
    private ingestionStatusRepository: Repository<IngestionStatus>,
  ) {}

  async create(
    documentId: number,
    status: string,
    message?: string,
  ): Promise<IngestionStatus> {
    const ingestionStatus = this.ingestionStatusRepository.create({
      documentId,
      status,
      message,
    });
    return this.ingestionStatusRepository.save(ingestionStatus);
  }

  async findAll(): Promise<IngestionStatus[]> {
    return this.ingestionStatusRepository.find();
  }

  async findOne(documentId: number): Promise<IngestionStatus | undefined> {
    return this.ingestionStatusRepository.findOne({ where: { documentId } });
  }

  async update(
    documentId: number,
    status: string,
    message?: string,
  ): Promise<IngestionStatus> {
    const ingestionStatus = await this.findOne(documentId);
    if (!ingestionStatus) {
      throw new NotFoundException(
        `Ingestion status for document ${documentId} not found`,
      );
    }
    await this.ingestionStatusRepository.update({ documentId }, { status, message });
    return this.findOne(documentId);
  }

  async remove(documentId: number): Promise<void> {
    const ingestionStatus = await this.findOne(documentId);
    if (!ingestionStatus) {
      throw new NotFoundException(
        `Ingestion status for document ${documentId} not found`,
      );
    }
    await this.ingestionStatusRepository.delete({ documentId });
  }

  async updateIngestionStatus(
    documentId: number,
    status: string,
    message?: string,
  ): Promise<IngestionStatus> {
    const ingestionStatus = await this.findOne(documentId);
    if (!ingestionStatus) {
      throw new NotFoundException(
        `Ingestion status for document ${documentId} not found`,
      );
    }
    await this.ingestionStatusRepository.update({ documentId }, { status, message });
    return this.findOne(documentId);
  }
}