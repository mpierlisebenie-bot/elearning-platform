import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Course } from '../course/course.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  idCategory: number;

  @Column()
  nom: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Course, (course) => course.category, { cascade: true })
  courses: Course[];
}
