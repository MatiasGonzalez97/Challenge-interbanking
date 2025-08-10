import { Body, Controller, Get, Post } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { Transfer } from './entities/transfer.entity';

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Get()
  async findAll(): Promise<Transfer[]> {
    return this.transfersService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateTransferDto): Promise<Transfer> {
    return this.transfersService.create(dto);
  }
}
