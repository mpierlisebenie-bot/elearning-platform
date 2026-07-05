import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './lesson.entity';
import { Course } from '../course/course.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  // Créer une leçon dans un cours
  async createLesson(dto: CreateLessonDto): Promise<Lesson> {
    const course = await this.courseRepository.findOne({ where: { id: dto.courseId } });
    if (!course) throw new NotFoundException(`Cours avec l'ID ${dto.courseId} introuvable`);

    // Ordre par défaut : à la suite des leçons existantes
    let ordre = dto.ordre;
    if (!ordre) {
      const count = await this.lessonRepository.count({ where: { course: { id: dto.courseId } } });
      ordre = count + 1;
    }

    const lesson = this.lessonRepository.create({ ...dto, ordre, course });
    return this.lessonRepository.save(lesson);
  }

  // Leçons d'un cours, dans l'ordre
  findByCourse(courseId: number): Promise<Lesson[]> {
    return this.lessonRepository.find({
      where: { course: { id: courseId } },
      order: { ordre: 'ASC', id: 'ASC' },
    });
  }

  async findLesson(id: number): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ['course'],
    });
    if (!lesson) throw new NotFoundException(`Leçon avec l'ID ${id} introuvable`);
    return lesson;
  }

  async updateLesson(id: number, dto: UpdateLessonDto): Promise<Lesson> {
    const lesson = await this.findLesson(id);
    Object.assign(lesson, dto);
    return this.lessonRepository.save(lesson);
  }

  async deleteLesson(id: number): Promise<void> {
    const result = await this.lessonRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Leçon avec l'ID ${id} introuvable`);
  }
}
