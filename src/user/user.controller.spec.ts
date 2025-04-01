import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOneById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call usersService.create with the createUserDto', async () => {
      const createUserDto: CreateUserDto = { username: 'testuser', password: 'password', role: 'user' };
      const createdUser = { id: 1, ...createUserDto };

      mockUsersService.create.mockResolvedValue(createdUser);

      const result = await controller.create(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createdUser);
    });
  });

  describe('findAll', () => {
    it('should call usersService.findAll', async () => {
      const users = [{ id: 1, username: 'user1', role: 'user' }, { id: 2, username: 'user2', role: 'admin' }];

      mockUsersService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(usersService.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should call usersService.findOneById with the id', async () => {
      const user = { id: 1, username: 'testuser', role: 'user' };

      mockUsersService.findOneById.mockResolvedValue(user);

      const result = await controller.findOne('1');

      expect(usersService.findOneById).toHaveBeenCalledWith(1);
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should call usersService.update with the id and updateUserDto', async () => {
      const updateUserDto: UpdateUserDto = { username: 'updateduser', role: 'admin' };
      const updatedUser = { id: 1, ...updateUserDto };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update('1', updateUserDto);

      expect(usersService.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should call usersService.remove with the id', async () => {
      const removedUser = { id: 1, username: 'testuser', role: 'user' };

      mockUsersService.remove.mockResolvedValue(removedUser);

      const result = await controller.remove('1');

      expect(usersService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(removedUser);
    });
  });
});