import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

import { ResumeService } from './resume.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Resume')
@ApiBearerAuth()
@Controller('resume')
@UseGuards(JwtAuthGuard)
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post('upload')
  @UseGuards(RolesGuard)
  @Roles(Role.STUDENT)
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: diskStorage({
        destination: './uploads/resumes',
        filename: (_, file, callback) => {
          const filename = `${Date.now()}-${file.originalname}`;
          callback(null, filename);
        },
      }),
      fileFilter: (_, file, callback) => {
        if (file.originalname.match(/\.(jpg|jpeg|pdf)$/i)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException('Only JPG, JPEG, and PDF files are accepted'),
            false,
          );
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadResume(
    @CurrentUser('id') userId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.resumeService.uploadResume(userId, file);
  }

  @Get('my-resume')
  @UseGuards(RolesGuard)
  @Roles(Role.STUDENT)
  getMyResume(@CurrentUser('id') userId: number) {
    return this.resumeService.getResume(userId);
  }

  @Delete('delete/resume')
  @UseGuards(RolesGuard)
  @Roles(Role.STUDENT)
  deleteResume(@CurrentUser('id') userId: number) {
    return this.resumeService.deleteResume(userId);
  }

  @Get('student/:studentId')
  @UseGuards(RolesGuard)
  @Roles(Role.RECRUITER, Role.ADMIN)
  getStudentResume(
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.resumeService.getResume(studentId);
  }
}
