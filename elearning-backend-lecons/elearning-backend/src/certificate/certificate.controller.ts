import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/user.entity';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { Certificate } from './certificate.entity';

@Controller('certificates')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  // POST /certificates — délivrer un certificat (admin ou instructeur)
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  @Post()
  createCertificate(@Body() dto: CreateCertificateDto): Promise<Certificate> {
    return this.certificateService.createCertificate(dto);
  }

  // GET /certificates — tous les certificats (admin uniquement)
  @Roles(Role.ADMIN)
  @Get()
  findAllCertificates(): Promise<Certificate[]> {
    return this.certificateService.findAllCertificates();
  }

  // GET /certificates/user/:userId — certificats d'un utilisateur (connecté)
  @Get('user/:userId')
  findUserCertificates(@Param('userId', ParseIntPipe) userId: number): Promise<Certificate[]> {
    return this.certificateService.findUserCertificates(userId);
  }

  // GET /certificates/:id — un certificat (connecté)
  @Get(':id')
  findCertificate(@Param('id', ParseIntPipe) id: number): Promise<Certificate> {
    return this.certificateService.findCertificate(id);
  }

  // DELETE /certificates/:id — supprimer un certificat (admin uniquement)
  @Roles(Role.ADMIN)
  @Delete(':id')
  deleteCertificate(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.certificateService.deleteCertificate(id);
  }
}
