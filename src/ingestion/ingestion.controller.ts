import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { IngestionStatusService } from './ingestion.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CreateIngestionStatusDto } from './dto/create-ingestion.dto'; // Import your DTOs
import { UpdateIngestionStatusDto } from './dto/update-ingestion.dto';

@Controller('ingestion-status')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('ingestion-status')
@ApiBearerAuth()
export class IngestionStatusController {
  constructor(private readonly ingestionStatusService: IngestionStatusService) {}

  @Post()
  @Roles('admin')
  @ApiBody({ type: CreateIngestionStatusDto })
  @ApiCreatedResponse({ description: 'Ingestion status created successfully.' })
  create(@Body() createIngestionStatusDto: CreateIngestionStatusDto) {
    return this.ingestionStatusService.create(createIngestionStatusDto.documentId, createIngestionStatusDto.status, createIngestionStatusDto.message);
  }

  @Get()
  @Roles('admin')
  @ApiOkResponse({ description: 'List of all ingestion statuses.' })
  findAll() {
    return this.ingestionStatusService.findAll();
  }

  @Get(':documentId')
  @Roles('admin')
  @ApiParam({ name: 'documentId', description: 'Document ID' })
  @ApiOkResponse({ description: 'Ingestion status for the specified document.' })
  findOne(@Param('documentId') documentId: string) {
    return this.ingestionStatusService.findOne(+documentId);
  }

  @Patch(':documentId')
  @Roles('admin')
  @ApiParam({ name: 'documentId', description: 'Document ID' })
  @ApiBody({ type: UpdateIngestionStatusDto })
  @ApiOkResponse({ description: 'Ingestion status updated successfully.' })
  update(
    @Param('documentId') documentId: string,
    @Body() updateIngestionStatusDto: UpdateIngestionStatusDto,
  ) {
    return this.ingestionStatusService.update(+documentId, updateIngestionStatusDto.status, updateIngestionStatusDto.message);
  }

  @Delete(':documentId')
  @Roles('admin')
  @ApiParam({ name: 'documentId', description: 'Document ID' })
  @ApiOkResponse({ description: 'Ingestion status deleted successfully.' })
  remove(@Param('documentId') documentId: string) {
    return this.ingestionStatusService.remove(+documentId);
  }

  @Patch(':documentId/status')
  @Roles('admin')
  @ApiParam({ name: 'documentId', description: 'Document ID' })
  @ApiBody({ type: UpdateIngestionStatusDto })
  @ApiOkResponse({ description: 'Ingestion status updated successfully.' })
  async updateIngestionStatus(
    @Param('documentId') documentId: string,
    @Body() updateIngestionStatusDto: UpdateIngestionStatusDto,
  ) {
    return this.ingestionStatusService.updateIngestionStatus(+documentId, updateIngestionStatusDto.status, updateIngestionStatusDto.message);
  }
}