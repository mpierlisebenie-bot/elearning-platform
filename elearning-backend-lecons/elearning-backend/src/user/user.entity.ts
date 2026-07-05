import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Enrollment } from '../enrollment/enrollment.entity';
import { Certificate } from '../certificate/certificate.entity';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  INSTRUCTOR = 'instructor',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string; // Hashé avec bcrypt — jamais renvoyé par défaut

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.user)
  enrollments: Enrollment[];

  @OneToMany(() => Certificate, (certificate) => certificate.user)
  certificates: Certificate[];
}
