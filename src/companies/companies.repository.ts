import { Injectable } from '@nestjs/common';
import { JsonRepository } from '../database/json.repository';
import { Company } from './entities/company.entity';
import * as path from 'path';

@Injectable()
export class CompaniesRepository extends JsonRepository<Company> {
  constructor() {
    const filePath = path.resolve(
      process.cwd(),
      'src',
      'database',
      'companies.json',
    );
    super(filePath);
  }
}
