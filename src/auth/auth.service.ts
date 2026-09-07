import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService 
{
    constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,) {}

    async register(registerDto: RegisterDto) {

        const existingUser = await this.usersService.findByEmail(
        registerDto.email,
        );

        if (existingUser.data) {
        throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(
        registerDto.password,
        10,
        );

        const user = await this.usersService.create({
        ...registerDto,
        password: hashedPassword,
        });

        return {
        message: 'Registration successful',
        data: user,
        };
  }

  async login(loginDto: LoginDto) {

    const userOb = await this.usersService.findByEmail(
      loginDto.email,
    );
    const user = userOb.data;

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const matched = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!matched) {
      throw new UnauthorizedException(
        'Invalid  password',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }


}
