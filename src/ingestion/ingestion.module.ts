import { Module } from '@nestjs/common';
import { IngestionStatusService } from './ingestion.service';
import { IngestionStatusController } from './ingestion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestionStatus } from '../entities/ingestion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IngestionStatus])],
  controllers: [IngestionStatusController],
  providers: [IngestionStatusService],
})
export class IngestionStatusModule {}