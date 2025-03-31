import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) 
    private readonly usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, sub: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({ where: { username: registerDto.username } });
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    const user = new User();
    user.username = registerDto.username;
    user.role = registerDto.role;
    user.passwordHash = passwordHash;

    console.log('User object before save:', user); // Add this line

    try {
      const savedUser = await this.usersRepository.save(user);
      return savedUser;
    } catch (error) {
      console.error('Error saving user:', error);
      throw error; // Re-throw the error to be handled by NestJS
    }
  }
}