import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
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
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn().mockResolvedValue(mockUser),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      userRepository.findOne.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      const createUserDto = { username: 'newUser', password: 'password', role: 'editor' };
      const result = await usersService.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw an error if username already exists', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      const createUserDto = { username: 'testuser', password: 'password', role: 'editor' };
      await expect(usersService.create(createUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      userRepository.find.mockResolvedValue([mockUser]);
      const result = await usersService.findAll();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user by username', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      const result = await usersService.findOne('testuser');
      expect(result).toEqual(mockUser);
    });
  });

  describe('findOneById', () => {
    it('should return a user by ID', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      const result = await usersService.findOneById(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      const updateUserDto = { username: 'updatedUser', password: 'newPassword', role: 'admin' };
      await usersService.update(1, updateUserDto);

      expect(userRepository.update).toHaveBeenCalled();
      expect(userRepository.findOne).toHaveBeenCalled();
    });

    it('should throw an error if user does not exist', async () => {
      userRepository.findOne.mockResolvedValue(null);
      const updateUserDto = { username: 'updatedUser', password: 'newPassword', role: 'admin' };
      await expect(usersService.update(1, updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      await usersService.remove(1);
      expect(userRepository.delete).toHaveBeenCalled();
    });

    it('should throw an error if user does not exist', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(usersService.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});