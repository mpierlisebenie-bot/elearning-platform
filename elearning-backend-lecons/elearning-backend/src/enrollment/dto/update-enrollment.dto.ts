import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { EnrollmentStatus } from '../enrollment.entity';

export class UpdateEnrollmentDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progression?: number;

  @IsOptional()
  @IsEnum(EnrollmentStatus)
  statut?: EnrollmentStatus;
}
