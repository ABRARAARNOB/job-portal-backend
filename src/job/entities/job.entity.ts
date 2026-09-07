import { Application } from 'src/application/entities/application.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';


@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 150,
  })
  title: string;

  @Column({
    length: 150,
  })
  company: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  salary: number;

  @Column({
    type: 'text',
  })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


  @ManyToOne(() => User, (user) => user.jobs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  recruiter: User;
  

  @OneToMany(() => Application, (application) => application.job)
  applications: Application[];

  
}