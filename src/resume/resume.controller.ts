import { BadRequestException, Controller, Delete, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('resume')
@UseGuards(JwtAuthGuard)
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: diskStorage({
        destination: './uploads/resumes',

        filename: (_, file, callback) => {
          const unique =
            Date.now() +
            '-' +
            file.originalname;

          callback(null, file.originalname,);
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
  uploadResume(@Req() req, @UploadedFile() file: Express.Multer.File,)
  {
    return this.resumeService.uploadResume(
      req.user.id,
      file,
    );
  }


  @Get('me')
  getResume(@Req() req) {
    return this.resumeService.getResume(req.user.id,);
  }

  
  @Delete()
  deleteResume(@Req() req) {
    return this.resumeService.deleteResume(
      req.user.id,
    );
  }

}
