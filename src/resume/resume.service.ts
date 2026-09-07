import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Resume } from './entities/resume.entity';
import { UserNotFoundException } from 'src/common/exceptions/user-not-found.exception';

@Injectable()
export class ResumeService 
{
    constructor(@InjectRepository(Resume)private readonly resumeRepository: Repository<Resume>,
                @InjectRepository(User) private readonly userRepository: Repository<User>){}

    
    async uploadResume(userId: number,file: Express.Multer.File,)
    {
    
        const user = await this.userRepository.findOne({ where: { id: userId }, });

        if (!user) {
        throw new UserNotFoundException();
        }

        const existingResume = await this.resumeRepository.findOne({
        where: {
            user: {
            id: userId,
            },
        },
        relations: {
            user: true,
            },
        });

        
        if (existingResume) {
        await this.resumeRepository.remove(existingResume);
        }

        const resume = this.resumeRepository.create({
        fileName: file.originalname,
        filePath: file.path,
        fileSize: file.size,
        user,
        });

        return await this.resumeRepository.save(resume);
    }

    async getResume(userId: number) 
    {
        const resume = await this.resumeRepository.findOne({
        where: {
            user: {
            id: userId,
            },
        },
        relations: {
            user: true,
            },
        });

        if (!resume) {
        throw new NotFoundException('Resume not found');
        }

        return resume;
  }

  async deleteResume(userId: number) 
  {
    const resume = await this.resumeRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
        }
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    await this.resumeRepository.remove(resume);

    return {
      message: 'Resume deleted successfully',
    };
  }

}
