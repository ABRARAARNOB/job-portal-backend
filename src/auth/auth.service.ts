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
import { MailService } from 'src/mail/mail.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService 
{
    constructor( private readonly usersService: UserService,
                private readonly jwtService: JwtService,
                private readonly mailService: MailService,
                private readonly mailerService: MailerService) {}


    async sendMail(to: string, subject: string, text: string) 
    {
        const result = await this.mailerService.sendMail({
            to,
            subject,
            text,
          });

    }


    async register(registerDto: RegisterDto) 
    {
        let existingUser;
        try {
            existingUser = await this.usersService.findByEmail(registerDto.email);
        } catch (error) {
            // User not found, this is expected for a new registration
        }

        if (existingUser && existingUser.data) 
        {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash( registerDto.password, 10,);

        const user = await this.usersService.create({
          ...registerDto,
          password: hashedPassword,
        });
      
        await this.mailService.sendMail(user.data.email, 'Welcome to University Job Portal','Hello, welcome to our University Job Portal!',);

        return {
          message: 'Registration successful',
          data: user,
        };
  }

  async login(loginDto: LoginDto) 
  {
    const userOb = await this.usersService.findByEmail(loginDto.email,);
    const user = userOb.data;

    if (!user) 
    {
      throw new UnauthorizedException('Invalid email ',);
    }

    const matched = await bcrypt.compare( loginDto.password,user.password,);

    if (!matched) 
    {
      throw new UnauthorizedException( 'Invalid  password',);
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getMe(id: number) {
    const user = await this.usersService.findById(id);

    return {
      id: user.data.id,
      email: user.data.email,
      role: user.data.role,
    };
  }


}
