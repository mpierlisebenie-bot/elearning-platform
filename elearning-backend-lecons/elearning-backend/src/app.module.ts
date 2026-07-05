import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { CategoryModule } from './category/category.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { CertificateModule } from './certificate/certificate.module';
import { WeatherModule } from './weather/weather.module';
import { LessonModule } from './lesson/lesson.module';
import { User } from './user/user.entity';
import { Course } from './course/course.entity';
import { Category } from './category/category.entity';
import { Enrollment } from './enrollment/enrollment.entity';
import { Certificate } from './certificate/certificate.entity';
import { Lesson } from './lesson/lesson.entity';

@Module({
  imports: [
    // Charge le fichier .env et rend ConfigService disponible partout
    ConfigModule.forRoot({ isGlobal: true }),

    // Connexion MySQL configurée via les variables d'environnement (.env)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: parseInt(config.get<string>('DB_PORT', '3306'), 10),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_NAME', 'elearning-db'),
        entities: [User, Course, Category, Enrollment, Certificate, Lesson],
        // ⚠️ synchronize: true uniquement en développement
        synchronize: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    AuthModule,
    UsersModule,
    CourseModule,
    CategoryModule,
    EnrollmentModule,
    CertificateModule,
    WeatherModule,
    LessonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
