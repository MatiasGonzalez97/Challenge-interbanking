import { Body, Controller, Get, Post } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './entities/company.entity';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  async findAll(): Promise<Company[]> {
    return this.companiesService.findAll();
  }

  @Get('joined-last-month')
  async joinedLastMonth(): Promise<Company[]> {
    return this.companiesService.findJoinedLastMonth();
  }

  @Get('transferred-last-month')
  async transferredLastMonth(): Promise<Company[]> {
    return this.companiesService.findWithTransfersLastMonth();
  }

  @Post()
  async create(@Body() dto: CreateCompanyDto): Promise<Company> {
    return this.companiesService.create(dto);
  }
}
