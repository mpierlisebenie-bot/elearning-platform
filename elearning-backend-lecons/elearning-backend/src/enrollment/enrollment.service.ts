import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { User } from '../user/user.entity';
import { Course } from '../course/course.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  // Inscrire un utilisateur à un cours
  async createEnrollment(dto: CreateEnrollmentDto): Promise<Enrollment> {
    // Vérifier que l'utilisateur et le cours existent (404 propre plutôt qu'une erreur SQL)
    const user = await this.userRepository.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException(`Utilisateur avec l'ID ${dto.userId} introuvable`);

    const course = await this.courseRepository.findOne({ where: { id: dto.courseId } });
    if (!course) throw new NotFoundException(`Cours avec l'ID ${dto.courseId} introuvable`);

    // Vérifier si déjà inscrit
    const existing = await this.enrollmentRepository.findOne({
      where: {
        user: { id: dto.userId },
        course: { id: dto.courseId },
      },
    });
    if (existing) throw new ConflictException('Utilisateur déjà inscrit à ce cours');

    const enrollment = this.enrollmentRepository.create({ user, course });
    const saved = await this.enrollmentRepository.save(enrollment);

    // Tenir le compteur d'inscrits du cours à jour
    await this.courseRepository.increment({ id: dto.courseId }, 'nbInscrits', 1);

    return saved;
  }

  // Toutes les inscriptions (admin)
  findAllEnrollments(): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({ relations: ['user', 'course'] });
  }

  // Inscriptions d'un utilisateur
  findUserEnrollments(userId: number): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({
      where: { user: { id: userId } },
      relations: ['course', 'course.category'],
    });
  }

  // Trouver une inscription
  async findEnrollment(id: number): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id },
      relations: ['user', 'course'],
    });
    if (!enrollment) throw new NotFoundException(`Inscription avec l'ID ${id} introuvable`);
    return enrollment;
  }

  // Mettre à jour progression / statut
  async updateEnrollment(id: number, dto: UpdateEnrollmentDto): Promise<Enrollment> {
    const enrollment = await this.findEnrollment(id);
    Object.assign(enrollment, dto);
    return this.enrollmentRepository.save(enrollment);
  }

  // Se désinscrire
  async deleteEnrollment(id: number): Promise<void> {
    const enrollment = await this.findEnrollment(id); // 404 si introuvable
    const courseId = enrollment.course?.id;
    await this.enrollmentRepository.delete(id);
    // Décrémenter le compteur d'inscrits du cours
    if (courseId) {
      await this.courseRepository.decrement({ id: courseId }, 'nbInscrits', 1);
    }
  }
}
