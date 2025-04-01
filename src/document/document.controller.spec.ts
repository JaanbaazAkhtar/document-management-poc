import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './document.controller';
import { DocumentsService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let documentsService: DocumentsService;

  const mockDocumentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    uploadFile: jest.fn(), // added mock for upload file
    triggerIngestion: jest.fn(), //added mock for trigger ingestion
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        {
          provide: DocumentsService,
          useValue: mockDocumentsService,
        },
      ],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
    documentsService = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call documentsService.findAll', async () => {
      const documents = [{ id: 1, title: 'Test Document 1', filePath: '/test/path1' }, { id: 2, title: 'Test Document 2', filePath: '/test/path2' }];

      mockDocumentsService.findAll.mockResolvedValue(documents);

      const result = await controller.findAll();

      expect(documentsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(documents);
    });
  });

  describe('findOne', () => {
    it('should call documentsService.findOne with the id', async () => {
      const document = { id: 1, title: 'Test Document', filePath: '/test/path' };

      mockDocumentsService.findOne.mockResolvedValue(document);

      const result = await controller.findOne('1');

      expect(documentsService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(document);
    });
  });

  describe('update', () => {
    it('should call documentsService.update with the id and updateDocumentDto', async () => {
      const updateDocumentDto: UpdateDocumentDto = { title: 'Updated Document', filePath: '/updated/path' };
      const updatedDocument = { id: 1, ...updateDocumentDto };

      mockDocumentsService.update.mockResolvedValue(updatedDocument);

      const result = await controller.update('1', updateDocumentDto);

      expect(documentsService.update).toHaveBeenCalledWith(1, updateDocumentDto);
      expect(result).toEqual(updatedDocument);
    });
  });

  describe('remove', () => {
    it('should call documentsService.remove with the id', async () => {
      const removedDocument = { id: 1, title: 'Test Document', filePath: '/test/path' };

      mockDocumentsService.remove.mockResolvedValue(removedDocument);

      const result = await controller.remove('1');

      expect(documentsService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(removedDocument);
    });
  });

  describe('uploadFile', () => {
    it('should call documentsService.uploadFile with the file and request', async () => {
      const mockFile = { originalname: 'test.pdf', mimetype: 'application/pdf' };
      const mockRequest = {};
      const uploadResult = { message: 'File uploaded successfully' };

      mockDocumentsService.uploadFile.mockResolvedValue(uploadResult);

      const result = await controller.uploadFile(mockFile as any, mockRequest as any);

      expect(documentsService.create).toHaveBeenCalledWith(mockFile, mockRequest);
      expect(result).toEqual(uploadResult);
    });

    it('should throw HttpException for unsupported file type', async () => {
        const mockFile = { originalname: 'test.exe', mimetype: 'application/exe' };
        const mockRequest = {};

        await expect(controller.uploadFile(mockFile as any, mockRequest as any)).rejects.toThrow(HttpException);
      });
  });

  describe('triggerIngestion', () => {
    it('should call documentsService.triggerIngestion with the id', async () => {
      const ingestionResult = { message: 'Ingestion triggered' };

      mockDocumentsService.triggerIngestion.mockResolvedValue(ingestionResult);

      const result = await controller.triggerIngestion('1');

      expect(documentsService.triggerIngestion).toHaveBeenCalledWith(1);
      expect(result).toEqual(ingestionResult);
    });
  });
});