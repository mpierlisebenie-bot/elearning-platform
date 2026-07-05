import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from './certificate.entity';
import { CreateCertificateDto } from './dto/create-certificate.dto';

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(Certificate)
    private certificateRepository: Repository<Certificate>,
  ) {}

  // Délivrer un certificat
  createCertificate(dto: CreateCertificateDto): Promise<Certificate> {
    const certificate = this.certificateRepository.create({
      user: { id: dto.userId } as any,
      course: { id: dto.courseId } as any,
      codeUnique: dto.codeUnique,
    });
    return this.certificateRepository.save(certificate);
  }

  // Tous les certificats (admin)
  findAllCertificates(): Promise<Certificate[]> {
    return this.certificateRepository.find({ relations: ['user', 'course'] });
  }

  // Certificats d'un utilisateur
  findUserCertificates(userId: number): Promise<Certificate[]> {
    return this.certificateRepository.find({
      where: { user: { id: userId } },
      relations: ['course'],
    });
  }

  // Un certificat
  async findCertificate(id: number): Promise<Certificate> {
    const certificate = await this.certificateRepository.findOne({
      where: { id },
      relations: ['user', 'course'],
    });
    if (!certificate) throw new NotFoundException(`Certificat avec l'ID ${id} introuvable`);
    return certificate;
  }

  // Supprimer un certificat
  async deleteCertificate(id: number): Promise<void> {
    const result = await this.certificateRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Certificat avec l'ID ${id} introuvable`);
  }
}
