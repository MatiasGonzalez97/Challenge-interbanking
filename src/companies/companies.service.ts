import { Injectable, BadRequestException } from '@nestjs/common';
import { CompaniesRepository } from './companies.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './entities/company.entity';
import { randomUUID } from 'crypto';
import { TransfersRepository } from '../transfers/transfers.repository';
import { getLastMonthUtcDate } from 'src/common/date.utils';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly companiesRepository: CompaniesRepository,
    private readonly transfersRepository: TransfersRepository,
  ) {}

  async findAll(): Promise<Company[]> {
    return this.companiesRepository.findAll();
  }

  async findJoinedLastMonth(): Promise<Company[]> {
    const companies = await this.companiesRepository.findAll();

    const lastMonthUtc = getLastMonthUtcDate();

    return companies.filter((c) => new Date(c.fechaAdhesion) >= lastMonthUtc);
  }

  async findWithTransfersLastMonth(): Promise<Company[]> {
    const companies = await this.companiesRepository.findAll();
    const transfers = await this.transfersRepository.findAll();

    const lastMonthUtc = getLastMonthUtcDate();

    const companyIds = new Set(
      transfers
        .filter((t) => new Date(t.fecha) >= lastMonthUtc)
        .map((t) => t.empresaId),
    );

    return companies.filter((c) => companyIds.has(c.id));
  }

  async create(dto: CreateCompanyDto): Promise<Company> {
    const companies = await this.companiesRepository.findAll();
    const cleanCuit = dto.cuit.trim();
    const exists = companies.some((c) => c.cuit === cleanCuit);
    if (exists) {
      throw new BadRequestException(
        `Ya existe una empresa con el CUIT ${cleanCuit}`,
      );
    }
    const { fechaAdhesion, razonSocial, tipo } = dto;
    const newCompany: Company = {
      id: randomUUID(),
      fechaAdhesion: new Date(fechaAdhesion).toISOString(),
      cuit: cleanCuit,
      razonSocial,
      tipo,
    };

    companies.push(newCompany);
    await this.companiesRepository.saveAll(companies); //En lugar de guardarlo en un JSON se podría guardar en una base de datos

    return newCompany;
  }
}
