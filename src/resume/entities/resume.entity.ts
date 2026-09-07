import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';


@Entity('resumes')
export class Resume {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Column()
  filePath: string;

  @Column()
  fileSize: number;

  @CreateDateColumn()
  uploadedAt: Date;

  @OneToOne(() => User, (user) => user.resume, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}