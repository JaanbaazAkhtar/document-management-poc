import { Test, TestingModule } from '@nestjs/testing';
import { IngestionStatusService } from './ingestion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IngestionStatus } from '../entities/ingestion.entity';
import { NotFoundException } from '@nestjs/common';

describe('IngestionStatusService', () => {
  let ingestionStatusService: IngestionStatusService;
  let ingestionStatusRepository;

  const mockIngestionStatus = {
    documentId: 1,
    status: 'pending',
    message: 'Waiting for ingestion',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionStatusService,
        {
          provide: getRepositoryToken(IngestionStatus),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn().mockResolvedValue(mockIngestionStatus),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    ingestionStatusService = module.get<IngestionStatusService>(
      IngestionStatusService,
    );
    ingestionStatusRepository = module.get(getRepositoryToken(IngestionStatus));
  });

  it('should be defined', () => {
    expect(ingestionStatusService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new ingestion status', async () => {
      const result = await ingestionStatusService.create(1, 'pending', 'Waiting...');
      expect(result).toEqual(mockIngestionStatus);
      expect(ingestionStatusRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all ingestion statuses', async () => {
      ingestionStatusRepository.find.mockResolvedValue([mockIngestionStatus]);
      const result = await ingestionStatusService.findAll();
      expect(result).toEqual([mockIngestionStatus]);
    });
  });

  describe('findOne', () => {
    it('should return an ingestion status by document ID', async () => {
      ingestionStatusRepository.findOne.mockResolvedValue(mockIngestionStatus);
      const result = await ingestionStatusService.findOne(1);
      expect(result).toEqual(mockIngestionStatus);
    });
  });

  describe('update', () => {
    it('should update an ingestion status', async () => {
      ingestionStatusRepository.findOne.mockResolvedValue(mockIngestionStatus);
      await ingestionStatusService.update(1, 'processing', 'Processing...');
      expect(ingestionStatusRepository.update).toHaveBeenCalled();
    });

    it('should throw an error if ingestion status does not exist', async () => {
      ingestionStatusRepository.findOne.mockResolvedValue(null);
      await expect(
        ingestionStatusService.update(1, 'processing', 'Processing...'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an ingestion status', async () => {
      ingestionStatusRepository.findOne.mockResolvedValue(mockIngestionStatus);
      await ingestionStatusService.remove(1);
      expect(ingestionStatusRepository.delete).toHaveBeenCalled();
    });

    it('should throw an error if ingestion status does not exist', async () => {
      ingestionStatusRepository.findOne.mockResolvedValue(null);
      await expect(ingestionStatusService.remove(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});