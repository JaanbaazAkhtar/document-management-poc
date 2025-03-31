import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIngestionStatusDto {
    @ApiProperty({ description: 'The ID of the document' })
    documentId: number;
  
    @ApiProperty({ description: 'The status of the ingestion', enum: ['pending', 'processing', 'completed', 'failed'] })
    @IsString()
    @IsIn(['pending', 'processing', 'completed', 'failed'])
    status: string;
  
    @ApiProperty({ description: 'The message associated with the ingestion status', required: false })
    @IsOptional()
    @IsString()
    message?: string;
  }