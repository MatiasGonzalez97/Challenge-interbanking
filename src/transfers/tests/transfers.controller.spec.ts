import { Test, TestingModule } from '@nestjs/testing';
import { TransfersController } from '../transfers.controller';
import { TransfersService } from '../transfers.service';
import { CreateTransferDto } from '../dto/create-transfer.dto';

describe('TransfersController', () => {
  let controller: TransfersController;
  let service: TransfersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransfersController],
      providers: [
        {
          provide: TransfersService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransfersController>(TransfersController);
    service = module.get<TransfersService>(TransfersService);
  });

  it('findAll debería llamar al service', async () => {
    (service.findAll as jest.Mock).mockResolvedValue([{ id: 't1' }]);
    const result = await controller.findAll();
    expect(result).toEqual([{ id: 't1' }]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('create debería llamar al service con DTO', async () => {
    const dto: CreateTransferDto = {
      empresaId: '1',
      importe: 1500,
      cuentaDebito: '0000000000000000000001',
      cuentaCredito: '0000000000000000000002',
    };

    (service.create as jest.Mock).mockResolvedValue({ id: 't2', ...dto });

    const result = await controller.create(dto);
    expect(result).toEqual({ id: 't2', ...dto });
    expect(service.create).toHaveBeenCalledWith(dto);
  });
});
