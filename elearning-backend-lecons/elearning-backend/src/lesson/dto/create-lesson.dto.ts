import { IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  titre: string;

  @IsOptional()
  @IsString()
  contenu?: string;

  @IsOptional()
  @IsUrl({}, { message: "videoUrl doit être une URL valide (ex: lien YouTube)" })
  videoUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  ordre?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  dureeMinutes?: number;

  @IsInt()
  courseId: number;
}
