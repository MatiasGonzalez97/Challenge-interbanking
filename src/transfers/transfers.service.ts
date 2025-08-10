import { Injectable } from '@nestjs/common';
import { TransfersRepository } from './transfers.repository';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { Transfer } from './entities/transfer.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class TransfersService {
  constructor(private readonly transfersRepository: TransfersRepository) {}

  async findAll(): Promise<Transfer[]> {
    return this.transfersRepository.findAll();
  }

  async create(dto: CreateTransferDto): Promise<Transfer> {
    const transfers = await this.transfersRepository.findAll();

    const newTransfer: Transfer = {
      id: randomUUID(),
      ...dto,
      fecha: new Date().toISOString(),
    };

    transfers.push(newTransfer);
    await this.transfersRepository.saveAll(transfers);

    return newTransfer;
  }
}
