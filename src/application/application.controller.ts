import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApplicationService } from './application.service';
import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Req,
  Body,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Role } from 'src/common/enums/role.enum';
import { UpdateStatusDto } from './dtos/update-status.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('Applications')
@ApiBearerAuth()
@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post('apply/:jobId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  apply(
    @Param('jobId', ParseIntPipe) jobId: number,
    @CurrentUser('id') studentId: number,
  ) {
    return this.applicationService.apply(jobId, studentId);
  }


  @Get('my-application')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  myApplications(
    @CurrentUser('id') studentId: number,
  ) {
    return this.applicationService.myApplications(studentId);
  }

  @Get('search-job')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  searchAppliedJobs(
    @CurrentUser('id') studentId: number,
    @Query('title') title?: string,
  ) {
    return this.applicationService.searchAppliedJobs(studentId, title);
  }

  @Get('filter-salary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  filterAppliedJobsBySalary(
    @CurrentUser('id') studentId: number,
    @Query('minSalary') minSalary?: string,
    @Query('maxSalary') maxSalary?: string,
  ) {
    const min = minSalary ? Number(minSalary) : undefined;
    const max = maxSalary ? Number(maxSalary) : undefined;
    return this.applicationService.filterAppliedJobsBySalary(studentId, min, max);
  }

  @Get('PostedJob/:jobId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RECRUITER)
  getApplicants(
    @Param('jobId', ParseIntPipe) jobId: number,
    @CurrentUser('id') recruiterId: number,
  ) {
    return this.applicationService.getApplicants(
      jobId,
      recruiterId,
    );
  }

  @Patch('PostedJob/:applicationId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RECRUITER)
  updateStatus(
    @Param('applicationId', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
    @CurrentUser('id') recruiterId: number,
  ) {
    return this.applicationService.updateStatus(
      id,
      recruiterId,
      dto,
    );
  }
}
