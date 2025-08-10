import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompaniesModule } from './companies/companies.module';
import { TransfersModule } from './transfers/transfers.module';

@Module({
  imports: [CompaniesModule, TransfersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
