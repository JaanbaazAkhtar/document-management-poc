import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({ description: 'The title of the document', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'The file path of the document', maxLength: 1000 })
  @IsString()
  @IsNotEmpty()
  filePath: string;

}