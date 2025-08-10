import { Injectable } from '@nestjs/common';
import { JsonRepository } from '../database/json.repository';
import { Transfer } from './entities/transfer.entity';
import * as path from 'path';

@Injectable()
export class TransfersRepository extends JsonRepository<Transfer> {
  constructor() {
    const filePath = path.resolve(
      process.cwd(),
      'src',
      'database',
      'transfers.json',
    );
    super(filePath);
  }
}
