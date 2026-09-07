import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Role } from 'src/common/enums/role.enum';
import { Job } from 'src/job/entities/job.entity';
import { Application } from 'src/application/entities/application.entity';
import { Resume } from 'src/resume/entities/resume.entity';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  fullName: string;

  @Column({
    type: 'varchar',
    length: 150,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
  })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.STUDENT,
  })
  role: Role;

  @Column({
    type: 'int',
  })
  graduationYear: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  bio: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  profilePicture: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(()=> Job, (job) => job.recruiter)
  jobs: Job[];

  @OneToMany(()=> Application, (application) => application.student)
  applications: Application[];

  @OneToOne(() => Resume, (resume) => resume.user)
    resume: Resume;





}