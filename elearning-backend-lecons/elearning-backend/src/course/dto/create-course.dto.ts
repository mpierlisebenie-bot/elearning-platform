import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Niveau } from '../course.entity';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  titre: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  instructeur: string;

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
