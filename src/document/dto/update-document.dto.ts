import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateDocumentDto {
  @ApiProperty({ description: 'The updated title of the document', maxLength: 255, required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'The updated file path of the document', required: false })
  @IsString()
  @IsOptional()
  filePath?: string;

  @ApiProperty({ description: 'The updated ingestion status of the document', required: false })
  @IsString()
  @IsOptional()
  ingestionStatus?: string;
}