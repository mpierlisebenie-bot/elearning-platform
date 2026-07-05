import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Category } from '../category/category.entity';
import { Enrollment } from '../enrollment/enrollment.entity';
import { Certificate } from '../certificate/certificate.entity';
import { Lesson } from '../lesson/lesson.entity';

export enum Niveau {
  DEBUTANT = 'debutant',
  INTERMEDIAIRE = 'intermediaire',
  AVANCE = 'avance',
}

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titre: string;

  @Column()
  description: string;

  @Column()
  instructeur: string;

  @Column({ type: 'enum', enum: Niveau, default: Niveau.DEBUTANT })
  niveau: Niveau;

  @Column({ type: 'float', default: 0 })
  dureeHeures: number;

  @Column({ default: true })
  disponible: boolean;

  @Column({ default: 0 })
  nbInscrits: number;

  @ManyToOne(() => Category, (category) => category.courses, { nullable: true, onDelete: 'SET NULL' })
  category: Category;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  @OneToMany(() => Certificate, (certificate) => certificate.course)
  certificates: Certificate[];

  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons: Lesson[];
}
