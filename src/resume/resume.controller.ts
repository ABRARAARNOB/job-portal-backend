import { BadRequestException, Controller, Delete, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
@UseGuards(JwtAuthGuard,RolesGuard)
@Roles(Role.STUDENT)
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  
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


  @Get('me')
  getResume( @CurrentUser('id') userId: number,) 
  {
    return this.resumeService.getResume(userId);
  }


  @Delete()
  deleteResume( @CurrentUser('id') userId: number,)
  {
    return this.resumeService.deleteResume(userId);
  }

}
