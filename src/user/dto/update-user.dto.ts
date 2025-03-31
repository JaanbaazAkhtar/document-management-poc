import { IsString, IsOptional, IsIn, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'The updated username of the user', maxLength: 50, required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  username?: string;

  @ApiProperty({ description: 'The updated password hash of the user', required: false })
  @IsString()
  @IsOptional()
  passwordHash?: string;

  @ApiProperty({ description: 'The updated password of the user', minLength: 8, required: false })
  @IsString()
  @IsOptional()
  @MinLength(8)
  password?: string;

  @ApiProperty({ description: 'The updated role of the user (admin, editor, user)', enum: ['admin', 'editor', 'user'], required: false })
  @IsString()
  @IsOptional()
  @IsIn(['admin', 'editor', 'user'])
  role?: string;
}