import { ApplicationStatus } from 'src/common/enums/application-status.emun';
import { Job } from 'src/job/entities/job.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';


@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @CreateDateColumn()
  appliedAt: Date;

  @ManyToOne(() => User, (user) => user.applications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  student: User;

  @ManyToOne(() => Job, (job) => job.applications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  job: Job;

  
}