import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [UserModule,
      JwtModule.register({
        secret: "awt2026",
        signOptions: {expiresIn: '7d'}
      }),MailModule
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtAuthGuard,RolesGuard,JwtStrategy],
})
export class AuthModule {}
