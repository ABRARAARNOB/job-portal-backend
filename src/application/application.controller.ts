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
} from '@nestjs/common';
import { Role } from 'src/common/enums/role.enum';
import { UpdateStatusDto } from './dtos/update-status.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post(':jobId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  apply(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Req() req,
  ) {
    return this.applicationService.apply(jobId, req.user.id);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  myApplications(@Req() req) {
    return this.applicationService.myApplications(req.user.id);
  }

  @Get('job/:jobId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RECRUITER)
  getApplicants(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Req() req,
  ) {
    return this.applicationService.getApplicants(
      jobId,
      req.user.id,
    );
  }

  @Patch(':applicationId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RECRUITER)
  updateStatus(
    @Param('applicationId', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
    @Req() req,
  ) {
    return this.applicationService.updateStatus(
      id,
      req.user.id,
      dto,
    );
  }
}
