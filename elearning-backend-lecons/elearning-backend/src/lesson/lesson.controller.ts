import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/user.entity';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from './lesson.entity';

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  // GET /lessons/course/:courseId — leçons d'un cours (connecté)
  @UseGuards(AuthGuard('jwt'))
  @Get('course/:courseId')
  findByCourse(@Param('courseId', ParseIntPipe) courseId: number): Promise<Lesson[]> {
    return this.lessonService.findByCourse(courseId);
  }

  // GET /lessons/:id — une leçon (connecté)
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findLesson(@Param('id', ParseIntPipe) id: number): Promise<Lesson> {
    return this.lessonService.findLesson(id);
  }

  // POST /lessons — créer une leçon (admin ou instructeur)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  @Post()
  createLesson(@Body() dto: CreateLessonDto): Promise<Lesson> {
    return this.lessonService.createLesson(dto);
  }

  // PUT /lessons/:id — modifier une leçon (admin ou instructeur)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  @Put(':id')
  updateLesson(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLessonDto,
  ): Promise<Lesson> {
    return this.lessonService.updateLesson(id, dto);
  }

  // DELETE /lessons/:id — supprimer une leçon (admin ou instructeur)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  @Delete(':id')
  deleteLesson(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.lessonService.deleteLesson(id);
  }
}
