import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Course } from '../course/course.entity';

export enum EnrollmentStatus {
  EN_COURS = 'en_cours',
  TERMINE = 'termine',
  ABANDONNE = 'abandonne',
}

@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.enrollments, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Course, (course) => course.enrollments, { onDelete: 'CASCADE' })
  course: Course;

  @Column({ type: 'float', default: 0 })
  progression: number; // 0 à 100

  @Column({ type: 'enum', enum: EnrollmentStatus, default: EnrollmentStatus.EN_COURS })
  statut: EnrollmentStatus;

  @CreateDateColumn()
  dateInscription: Date;
}
