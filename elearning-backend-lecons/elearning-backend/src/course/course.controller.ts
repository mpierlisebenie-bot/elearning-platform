import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/user.entity';
import { CourseService } from './course.service';
import { Course } from './course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CourseController {
  constructor(private readonly coursesService: CourseService) {}

  // GET /courses — liste publique
  @Get()
  findAllCourses(): Promise<Course[]> {
    return this.coursesService.findAllCourses();
  }

  // GET /courses/:id — un cours (public)
  @Get(':id')
  findCourse(@Param('id', ParseIntPipe) id: number): Promise<Course> {
    return this.coursesService.findCourse(id);
  }

  // POST /courses — créer un cours (admin ou instructeur)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  @Post()
  newCourse(@Body() dto: CreateCourseDto): Promise<Course> {
    return this.coursesService.newCourse(dto);
  }

  // PUT /courses/:id — modifier un cours (admin ou instructeur)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  @Put(':id')
  updateCourse(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCourseDto,
  ): Promise<Course> {
    return this.coursesService.updateCourse(id, dto);
  }

  // DELETE /courses/:id — supprimer un cours (admin uniquement)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  deleteCourse(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.coursesService.deleteCourse(id);
  }
}
