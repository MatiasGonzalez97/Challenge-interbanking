import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { CompaniesRepository } from './companies.repository';
import { TransfersRepository } from 'src/transfers/transfers.repository';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, CompaniesRepository, TransfersRepository],
})
export class CompaniesModule {}
