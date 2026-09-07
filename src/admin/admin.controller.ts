import { AdminService } from './admin.service';
import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  dashboard() 
  {
    return this.adminService.dashboard();
  }


  @Get('users')
  users() 
  {
    return this.adminService.findAllUsers();
  }

  @Delete('users/:id')
  deleteUser( @Param('id', ParseIntPipe) id: number,) 
  {
    return this.adminService.deleteUser(id);
  }

  @Get('jobs')
  jobs() 
  {
    return this.adminService.findAllJobs();
  }

  @Delete('jobs/:id')
  deleteJob(@Param('id', ParseIntPipe) id: number,) 
  {
    return this.adminService.deleteJob(id);
  }

  @Get('applications')
  applications() 
  {
    return this.adminService.findAllApplications();
  }
}
