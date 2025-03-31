import { IsString, IsNotEmpty, IsOptional, IsIn, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'The username of the user', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'The password of the user', minLength: 8 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: 'The role of the user (admin, editor, user)', enum: ['admin', 'editor', 'user'], required: false })
  @IsOptional()
  @IsString()
  @IsIn(['admin', 'editor', 'user'])
  role?: string;
}