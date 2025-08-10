import { Test } from '@nestjs/testing';
import { CompaniesController } from '../companies.controller';
import { CompaniesService } from '../companies.service';
import { CreateCompanyDto } from '../dto/create-company.dto';

describe('CompaniesController', () => {
  let controller: CompaniesController;
  let service: CompaniesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [
        {
          provide: CompaniesService,
          useValue: {
            findAll: jest.fn(),
            findJoinedLastMonth: jest.fn(),
            findWithTransfersLastMonth: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CompaniesController>(CompaniesController);
    service = module.get<CompaniesService>(CompaniesService);
  });

  it('findAll debería llamar al service', async () => {
    (service.findAll as jest.Mock).mockResolvedValue([{ id: '1' }]);
    const result = await controller.findAll();
    expect(result).toEqual([{ id: '1' }]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('joinedLastMonth debería llamar al service', async () => {
    (service.findJoinedLastMonth as jest.Mock).mockResolvedValue([{ id: '2' }]);
    const result = await controller.joinedLastMonth();
    expect(result).toEqual([{ id: '2' }]);
    expect(service.findJoinedLastMonth).toHaveBeenCalled();
  });

  it('transferredLastMonth debería llamar al service', async () => {
    (service.findWithTransfersLastMonth as jest.Mock).mockResolvedValue([
      { id: '3' },
    ]);
    const result = await controller.transferredLastMonth();
    expect(result).toEqual([{ id: '3' }]);
    expect(service.findWithTransfersLastMonth).toHaveBeenCalled();
  });

  it('create debería llamar al service con DTO', async () => {
    const dto: CreateCompanyDto = {
      cuit: '30700000001',
      razonSocial: 'Test',
      tipo: 'PYME',
      fechaAdhesion: new Date(),
    };
    (service.create as jest.Mock).mockResolvedValue({ id: '4', ...dto });

    const result = await controller.create(dto);
    expect(result).toEqual({ id: '4', ...dto });
    expect(service.create).toHaveBeenCalledWith(dto);
  });
});
