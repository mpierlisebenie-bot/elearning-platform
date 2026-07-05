import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  // Récupérer tous les cours
  findAllCourses(): Promise<Course[]> {
    return this.coursesRepository.find({ relations: ['category'] });
  }

  // Récupérer un seul cours
  async findCourse(id: number): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!course) {
      throw new NotFoundException(`Le cours avec l'ID ${id} est introuvable`);
    }
    return course;
  }

  // Créer un nouveau cours
  async newCourse(dto: CreateCourseDto): Promise<Course> {
    const course = this.coursesRepository.create({
      titre: dto.titre,
      description: dto.description,
      instructeur: dto.instructeur,
      niveau: dto.niveau,
      dureeHeures: dto.dureeHeures,
      disponible: dto.disponible ?? true,
      category: dto.categoryId ? { idCategory: dto.categoryId } as any : null,
    });
    return this.coursesRepository.save(course);
  }

  // Modifier un cours (MAJ)
  async updateCourse(id: number, dto: UpdateCourseDto): Promise<Course> {
    const course = await this.findCourse(id);
    Object.assign(course, {
      ...dto,
      category: dto.categoryId ? { idCategory: dto.categoryId } as any : course.category,
    });
    return this.coursesRepository.save(course);
  }

  // Supprimer un cours
  async deleteCourse(id: number): Promise<void> {
    await this.coursesRepository.delete(id);
  }
}
