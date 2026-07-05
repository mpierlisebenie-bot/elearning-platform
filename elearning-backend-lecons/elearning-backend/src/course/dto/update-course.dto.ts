import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Niveau } from '../course.entity';

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  titre?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  instructeur?: string;

  @IsOptional()
  @IsEnum(Niveau)
  niveau?: Niveau;

  @IsOptional()
  @IsNumber()
  dureeHeures?: number;

  @IsOptional()
  @IsBoolean()
  disponible?: boolean;

  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
