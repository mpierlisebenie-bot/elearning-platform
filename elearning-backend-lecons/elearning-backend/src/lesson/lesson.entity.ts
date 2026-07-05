import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Course } from '../course/course.entity';

/**
 * Lesson — une leçon d'un cours.
 * Le contenu peut être un texte (cours écrit) et/ou une vidéo
 * (URL YouTube intégrée dans le lecteur du frontend).
 */
@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titre: string;

  @Column({ type: 'text', nullable: true })
  contenu: string; // Cours écrit (texte / markdown simple)

  @Column({ nullable: true })
  videoUrl: string; // Lien YouTube (watch, youtu.be ou embed)

  @Column({ default: 1 })
  ordre: number; // Position de la leçon dans le cours

  @Column({ type: 'int', default: 10 })
  dureeMinutes: number;

  @ManyToOne(() => Course, (course) => course.lessons, { onDelete: 'CASCADE' })
  course: Course;
}
