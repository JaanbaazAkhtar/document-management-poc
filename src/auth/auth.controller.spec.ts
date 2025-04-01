import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login with the validated user', async () => {
      const loginDto: LoginDto = { username: 'testuser', password: 'password' };
      const validatedUser = { id: 1, username: 'testuser' };
      const loginResult = { access_token: 'mockToken' };

      mockAuthService.validateUser.mockResolvedValue(validatedUser);
      mockAuthService.login.mockResolvedValue(loginResult);

      const result = await controller.login(loginDto);

      expect(authService.validateUser).toHaveBeenCalledWith(loginDto.username, loginDto.password);
      expect(authService.login).toHaveBeenCalledWith(validatedUser);
      expect(result).toEqual(loginResult);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto: LoginDto = { username: 'invaliduser', password: 'wrongpassword' };

      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should call authService.register with the registerDto', async () => {
      const registerDto: RegisterDto = { username: 'newuser', password: 'newpassword', role: 'user' };
      const registerResult = { id: 2, username: 'newuser' };

      mockAuthService.register.mockResolvedValue(registerResult);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(registerResult);
    });
  });
});