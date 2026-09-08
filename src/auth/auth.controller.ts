import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}


  @Post('register')
  register(@Body() registerDto: RegisterDto) 
  {
    return this.authService.register(registerDto);
  }


  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser('id') id: number) {
    return this.authService.getMe(id);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  )
  {
    const result = await this.authService.login(loginDto);
    const secure = process.env.NODE_ENV === 'production';

    response.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure,
      sameSite: secure ? 'none' : 'lax',
      maxAge: 60 * 60 * 1000,
    });

    return {
      message: 'Login successful',
      status: true,
    };
  }


}
