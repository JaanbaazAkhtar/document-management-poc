import { Test, TestingModule } from '@nestjs/testing';
import { IngestionStatusController } from './ingestion.controller';
import { IngestionStatusService } from './ingestion.service';
import { CreateIngestionStatusDto } from './dto/create-ingestion.dto';
import { UpdateIngestionStatusDto } from './dto/update-ingestion.dto';

describe('IngestionStatusController', () => {
  let controller: IngestionStatusController;
  let ingestionStatusService: IngestionStatusService;

  const mockIngestionStatusService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    updateIngestionStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionStatusController],
      providers: [
        {
          provide: IngestionStatusService,
          useValue: mockIngestionStatusService,
        },
      ],
    }).compile();

    controller = module.get<IngestionStatusController>(IngestionStatusController);
    ingestionStatusService = module.get<IngestionStatusService>(IngestionStatusService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call ingestionStatusService.create with the createIngestionStatusDto', async () => {
      const createIngestionStatusDto: CreateIngestionStatusDto = {
        documentId: 1,
        status: 'pending',
        message: 'Initial status',
      };
      const createdIngestionStatus = { id: 1, ...createIngestionStatusDto };

      mockIngestionStatusService.create.mockResolvedValue(createdIngestionStatus);

      const result = await controller.create(createIngestionStatusDto);

      expect(ingestionStatusService.create).toHaveBeenCalledWith(
        createIngestionStatusDto.documentId,
        createIngestionStatusDto.status,
        createIngestionStatusDto.message,
      );
      expect(result).toEqual(createdIngestionStatus);
    });
  });

  describe('findAll', () => {
    it('should call ingestionStatusService.findAll', async () => {
      const ingestionStatuses = [
        { id: 1, documentId: 1, status: 'pending', message: 'Initial status' },
        { id: 2, documentId: 2, status: 'processing', message: 'Processing document' },
      ];

      mockIngestionStatusService.findAll.mockResolvedValue(ingestionStatuses);

      const result = await controller.findAll();

      expect(ingestionStatusService.findAll).toHaveBeenCalled();
      expect(result).toEqual(ingestionStatuses);
    });
  });

  describe('findOne', () => {
    it('should call ingestionStatusService.findOne with the documentId', async () => {
      const ingestionStatus = { id: 1, documentId: 1, status: 'pending', message: 'Initial status' };

      mockIngestionStatusService.findOne.mockResolvedValue(ingestionStatus);

      const result = await controller.findOne('1');

      expect(ingestionStatusService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(ingestionStatus);
    });
  });

  describe('update', () => {
    it('should call ingestionStatusService.update with the documentId and updateIngestionStatusDto', async () => {
      const updateIngestionStatusDto: UpdateIngestionStatusDto = { status: 'processing', message: 'Updating status' };
      const updatedIngestionStatus = { id: 1, documentId: 1, ...updateIngestionStatusDto };

      mockIngestionStatusService.update.mockResolvedValue(updatedIngestionStatus);

      const result = await controller.update('1', updateIngestionStatusDto);

      expect(ingestionStatusService.update).toHaveBeenCalledWith(1, updateIngestionStatusDto.status, updateIngestionStatusDto.message);
      expect(result).toEqual(updatedIngestionStatus);
    });
  });

  describe('remove', () => {
    it('should call ingestionStatusService.remove with the documentId', async () => {
      const removedIngestionStatus = { id: 1, documentId: 1, status: 'pending', message: 'Initial status' };

      mockIngestionStatusService.remove.mockResolvedValue(removedIngestionStatus);

      const result = await controller.remove('1');

      expect(ingestionStatusService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(removedIngestionStatus);
    });
  });

  describe('updateIngestionStatus', () => {
    it('should call ingestionStatusService.updateIngestionStatus with the documentId and updateIngestionStatusDto', async () => {
      const updateIngestionStatusDto: UpdateIngestionStatusDto = { status: 'completed', message: 'Ingestion completed' };
      const updatedIngestionStatus = { id: 1, documentId: 1, ...updateIngestionStatusDto };

      mockIngestionStatusService.updateIngestionStatus.mockResolvedValue(updatedIngestionStatus);

      const result = await controller.updateIngestionStatus('1', updateIngestionStatusDto);

      expect(ingestionStatusService.updateIngestionStatus).toHaveBeenCalledWith(1, updateIngestionStatusDto.status, updateIngestionStatusDto.message);
      expect(result).toEqual(updatedIngestionStatus);
    });
  });
});