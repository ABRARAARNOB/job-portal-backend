import { JobService } from './job.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { CreateJobDto } from './dtos/create-job.dto';
import { UpdateJobDto } from './dtos/update-job.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';


@ApiTags('Jobs')
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  findAll() {
    return this.jobService.findAll();
  }

  @Get('my-jobs')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RECRUITER)
  findMyJobs(@CurrentUser('id') recruiterId: number) {
  return this.jobService.findMyJobs(recruiterId);
}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RECRUITER)
  create(
  @Body() dto: CreateJobDto,
  @CurrentUser('id') recruiterId: number,
  ) {
    return this.jobService.create(recruiterId, dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RECRUITER)
  update(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: UpdateJobDto,
  @CurrentUser('id') recruiterId: number,
  ) {
    return this.jobService.update(
      id,
      recruiterId,
      dto,
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RECRUITER)
  remove(
  @Param('id', ParseIntPipe) id: number,
  @CurrentUser('id') recruiterId: number,
  ) {
    return this.jobService.remove(id, recruiterId);
  }

}
