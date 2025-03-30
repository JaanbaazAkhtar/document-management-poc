import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userRepository;

  const mockUser = {
    id: 1,
    username: 'testuser',
    passwordHash: '$2b$10$somehashedpassword',
    role: 'viewer',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockedToken'),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.validateUser('testuser', 'password');
      expect(result).toEqual({ id: 1, username: 'testuser', role: 'viewer' });
    });

    it('should return null if credentials are invalid', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const result = await authService.validateUser('testuser', 'wrongPassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return a JWT token', async () => {
      const result = await authService.login(mockUser);
      expect(result).toEqual({ access_token: 'mockedToken' });
      expect(jwtService.sign).toHaveBeenCalled();
    });

      it('should throw an error if user is null', async () => {
          await expect(authService.login(null)).rejects.toThrow(UnauthorizedException);
      });
  });

  describe('register', () => {
      it('should register a new user', async () => {
          userRepository.findOne.mockResolvedValue(null);
          jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

          const registerDto = { username: 'newUser', password: 'password', role: 'editor' };
          const result = await authService.register(registerDto);

          expect(result).toEqual(mockUser);
          expect(userRepository.save).toHaveBeenCalled();
      });

      it('should throw an error if username already exists', async () => {
          userRepository.findOne.mockResolvedValue(mockUser);
          const registerDto = { username: 'testuser', password: 'password', role: 'editor' };
          await expect(authService.register(registerDto)).rejects.toThrow(BadRequestException);
      });
  });
});