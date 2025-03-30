import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { IngestionStatusService } from './ingestion.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('ingestion-status')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IngestionStatusController {
  constructor(private readonly ingestionStatusService: IngestionStatusService) {}

  @Post()
  @Roles('admin')
  create(@Body() { documentId, status, message }: { documentId: number; status: string; message?: string }) {
    return this.ingestionStatusService.create(documentId, status, message);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.ingestionStatusService.findAll();
  }

  @Get(':documentId')
  @Roles('admin')
  findOne(@Param('documentId') documentId: string) {
    return this.ingestionStatusService.findOne(+documentId);
  }

  @Patch(':documentId')
  @Roles('admin')
  update(
    @Param('documentId') documentId: string,
    @Body() { status, message }: { status: string; message?: string },
  ) {
    return this.ingestionStatusService.update(+documentId, status, message);
  }

  @Delete(':documentId')
  @Roles('admin')
  remove(@Param('documentId') documentId: string) {
    return this.ingestionStatusService.remove(+documentId);
  }
}