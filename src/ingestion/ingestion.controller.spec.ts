import { Test, TestingModule } from '@nestjs/testing';
import { IngestionStatusController } from './ingestion.controller';
import { IngestionStatusService } from './ingestion.service';

describe('IngestionStatusController', () => {
  let controller: IngestionStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionStatusController],
      providers: [IngestionStatusService],
    }).compile();

    controller = module.get<IngestionStatusController>(IngestionStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
