import { Controller, Post, Body, ValidationPipe, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiBody, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'User logged in successfully.', schema: { type: 'object', properties: { access_token: { type: 'string' } } } })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  async login(@Body(new ValidationPipe()) loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ description: 'User registered successfully.' })
  async register(@Body(new ValidationPipe()) registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}