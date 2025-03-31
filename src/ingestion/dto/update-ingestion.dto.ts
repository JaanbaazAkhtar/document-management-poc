import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateIngestionStatusDto {
    @ApiProperty({ description: 'The updated status of the ingestion', enum: ['pending', 'processing', 'completed', 'failed'], required: false })
    @IsOptional()
    @IsString()
    @IsIn(['pending', 'processing', 'completed', 'failed'])
    status?: string;
  
    @ApiProperty({ description: 'The updated message associated with the ingestion status', required: false })
    @IsOptional()
    @IsString()
    message?: string;
  }