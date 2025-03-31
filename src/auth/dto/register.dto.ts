import { IsString, IsNotEmpty, IsOptional, IsIn, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'The username of the user', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  username: string;

  @ApiProperty({ description: 'The password of the user', minLength: 8 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: 'The password hash of the user', required: false })
  @IsString()
  @IsOptional()
  passwordHash?: string;

  @ApiProperty({ description: 'The role of the user (admin, editor, user)', enum: ['admin', 'editor', 'user'], required: false })
  @IsString()
  @IsOptional()
  @IsIn(['admin', 'editor', 'user'])
  role?: string;
}