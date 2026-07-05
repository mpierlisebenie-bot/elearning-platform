import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Course } from '../course/course.entity';

@Entity()
export class Certificate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.certificates, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Course, (course) => course.certificates, { onDelete: 'CASCADE' })
  course: Course;

  @Column({ unique: true })
  codeUnique: string; // Ex: CERT-2026-001

  @CreateDateColumn()
  dateObtention: Date;
}
