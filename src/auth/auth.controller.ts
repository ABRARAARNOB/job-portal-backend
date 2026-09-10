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

  // =========================
  // REGISTER
  // =========================
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // =========================
  // LOGIN
  // =========================
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(loginDto);

    const isProduction = process.env.NODE_ENV === 'production';

    response.cookie('access_token', result.access_token, {
      httpOnly: true,

      // HTTPS is required for production Vercel/Render
      secure: isProduction,

      // Required for Vercel frontend -> Render backend
      sameSite: isProduction ? 'none' : 'lax',

      // 1 hour
      maxAge: 60 * 60 * 1000,

      // Cookie is available for all backend routes
      path: '/',
    });

    return {
      message: 'Login successful',
      status: true,
    };
  }

  // =========================
  // CURRENT USER
  // =========================
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser('id') id: number) {
    return this.authService.getMe(id);
  }

  // =========================
  // LOGOUT
  // =========================
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite:
        process.env.NODE_ENV === 'production'
          ? 'none'
          : 'lax',
      path: '/',
    });

    return {
      message: 'Logout successful',
      status: true,
    };
  }
}
