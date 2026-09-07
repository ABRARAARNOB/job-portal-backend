import { IsEnum } from 'class-validator';
import { ApplicationStatus } from 'src/common/enums/application-status.emun';

export class UpdateStatusDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}