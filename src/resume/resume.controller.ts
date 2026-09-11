import { BadRequestException, Controller, Delete, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Resume')
@Controller('resume')
@UseGuards(JwtAuthGuard)
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.STUDENT)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: diskStorage({
        destination: './uploads/resumes',

        filename: (_, file, callback) => {
          const name =
            Date.now() +
            '-' +
            file.originalname;

          callback(null, name,);
        },
      }),

      fileFilter: (res, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|jpeg|pdf)$/)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('file type not accepted'), false);
        }
      },
      limits:{
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadResume(@CurrentUser('id') userId: number,@UploadedFile() file: Express.Multer.File,) 
  {
    return this.resumeService.uploadResume(userId,file,);
  }


  @UseGuards(RolesGuard)
  @Roles(Role.STUDENT)
  @Get('my-resume')
  getResume( @CurrentUser('id') userId: number,) 
  {
    return this.resumeService.getResume(userId);
  }


  @UseGuards(RolesGuard)
  @Roles(Role.STUDENT)
  @Delete("delete/resume")
  deleteResume( @CurrentUser('id') userId: number,)
  {
    return this.resumeService.deleteResume(userId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.RECRUITER, Role.ADMIN)
  @Get(':id')
  getResumeById(@Param('id') id: number) {
    return this.resumeService.getResumeById(id);
  }



}
