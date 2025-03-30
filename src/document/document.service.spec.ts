import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './document.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { UsersService } from '../user/user.service';
import { ClientProxy } from '@nestjs/microservices';
import { NotFoundException } from '@nestjs/common';

describe('DocumentsService', () => {
  let documentsService: DocumentsService;
  let documentRepository;
  let usersService: UsersService;
  let clientProxy: ClientProxy;

  const mockDocument = {
    id: 1,
    title: 'test document',
    filePath: '/path/to/file',
    uploadedBy: { id: 1 },
    ingestionStatus: 'pending',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Document),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn().mockResolvedValue(mockDocument),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOneById: jest.fn().mockResolvedValue({ id: 1 }),
          },
        },
        {
          provide: 'INGESTION_SERVICE',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    documentsService = module.get<DocumentsService>(DocumentsService);
    documentRepository = module.get(getRepositoryToken(Document));
    usersService = module.get<UsersService>(UsersService);
    clientProxy = module.get<ClientProxy>('INGESTION_SERVICE');
  });

  it('should be defined', () => {
    expect(documentsService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new document', async () => {
      const createDocumentDto = { title: 'new document', filePath: '/new/path' };
      const result = await documentsService.create(createDocumentDto, 1);

      expect(result).toEqual(mockDocument);
      expect(documentRepository.save).toHaveBeenCalled();
    });

    it('should throw an error if user does not exist', async () => {
      jest.spyOn(usersService, 'findOneById').mockResolvedValue(null);
      const createDocumentDto = { title: 'new document', filePath: '/new/path' };
      await expect(documentsService.create(createDocumentDto, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all documents', async () => {
      documentRepository.find.mockResolvedValue([mockDocument]);
      const result = await documentsService.findAll();
      expect(result).toEqual([mockDocument]);
    });
  });

  describe('findOne', () => {
    it('should return a document by ID', async () => {
      documentRepository.findOne.mockResolvedValue(mockDocument);
      const result = await documentsService.findOne(1);
      expect(result).toEqual(mockDocument);
    });

    it('should throw an error if document does not exist', async () => {
      documentRepository.findOne.mockResolvedValue(null);
      await expect(documentsService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a document', async () => {
      documentRepository.findOne.mockResolvedValue(mockDocument);
      const updateDocumentDto = { title: 'updated document', filePath: '/updated/path' };
      await documentsService.update(1, updateDocumentDto);

      expect(documentRepository.update).toHaveBeenCalled();
      expect(documentRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a document', async () => {
      documentRepository.findOne.mockResolvedValue(mockDocument);
      await documentsService.remove(1);
      expect(documentRepository.delete).toHaveBeenCalled();
    });

    it('should throw an error if document does not exist', async () => {
      documentRepository.findOne.mockResolvedValue(null);
      await expect(documentsService.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('triggerIngestion', () => {
    it('should trigger ingestion', async () => {
      documentRepository.findOne.mockResolvedValue(mockDocument);
      await documentsService.triggerIngestion(1);

      expect(clientProxy.emit).toHaveBeenCalled();
      expect(documentRepository.update).toHaveBeenCalled();
    });

    it('should throw an error if document does not exist', async () => {
      documentRepository.findOne.mockResolvedValue(null);
      await expect(documentsService.triggerIngestion(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateIngestionStatus', () => {
    it('should update ingestion status', async () => {
      documentRepository.findOne.mockResolvedValue(mockDocument);
      await documentsService.updateIngestionStatus(1, 'completed');

      expect(documentRepository.update).toHaveBeenCalled();
    });
  });
});