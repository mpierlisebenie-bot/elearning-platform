import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/user.entity';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { Enrollment } from './enrollment.entity';

@Controller('enrollments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  // POST /enrollments — s'inscrire à un cours (connecté)
  @Post()
  createEnrollment(@Body() dto: CreateEnrollmentDto): Promise<Enrollment> {
    return this.enrollmentService.createEnrollment(dto);
  }

  // GET /enrollments — toutes les inscriptions (admin uniquement)
  @Roles(Role.ADMIN)
  @Get()
  findAllEnrollments(): Promise<Enrollment[]> {
    return this.enrollmentService.findAllEnrollments();
  }

  // GET /enrollments/user/:userId — inscriptions d'un utilisateur (connecté)
  @Get('user/:userId')
  findUserEnrollments(@Param('userId', ParseIntPipe) userId: number): Promise<Enrollment[]> {
    return this.enrollmentService.findUserEnrollments(userId);
  }

  // GET /enrollments/:id — une inscription (connecté)
  @Get(':id')
  findEnrollment(@Param('id', ParseIntPipe) id: number): Promise<Enrollment> {
    return this.enrollmentService.findEnrollment(id);
  }

  // PUT /enrollments/:id — mettre à jour progression (connecté)
  @Put(':id')
  updateEnrollment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEnrollmentDto,
  ): Promise<Enrollment> {
    return this.enrollmentService.updateEnrollment(id, dto);
  }

  // DELETE /enrollments/:id — se désinscrire (connecté)
  @Delete(':id')
  deleteEnrollment(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.enrollmentService.deleteEnrollment(id);
  }
}
