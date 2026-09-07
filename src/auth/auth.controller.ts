import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}


  @Post('register')
  register(@Body() registerDto: RegisterDto) 
  {
    return this.authService.register(registerDto);
  }


  @Post('login')
  login(@Body() loginDto: LoginDto) 
  {
    return this.authService.login(loginDto);
  }


}
