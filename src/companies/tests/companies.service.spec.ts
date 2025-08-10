/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException } from '@nestjs/common';
import { CompaniesService } from '../companies.service';
import { CompaniesRepository } from '../companies.repository';
import { TransfersRepository } from '../../transfers/transfers.repository';
import { CreateCompanyDto } from '../dto/create-company.dto';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let companiesRepo: jest.Mocked<CompaniesRepository>;
  let transfersRepo: jest.Mocked<TransfersRepository>;

  beforeEach(() => {
    companiesRepo = {
      findAll: jest.fn(() => undefined),
      saveAll: jest.fn(() => undefined),
    } as any;

    transfersRepo = {
      findAll: jest.fn(() => undefined),
    } as any;

    service = new CompaniesService(companiesRepo, transfersRepo);
  });

  describe('create', () => {
    it('debería crear una empresa nueva si el CUIT es único', async () => {
      companiesRepo.findAll.mockResolvedValue([]);
      companiesRepo.saveAll.mockResolvedValue(undefined);

      const dto: CreateCompanyDto = {
        cuit: '30700000001',
        razonSocial: 'Empresa Test',
        tipo: 'PYME',
        fechaAdhesion: new Date(),
      };

      const result = await service.create(dto);

      expect(result.cuit).toBe(dto.cuit);
      expect(result.razonSocial).toBe(dto.razonSocial);
      expect(result.tipo).toBe(dto.tipo);
      expect(companiesRepo.saveAll).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ cuit: dto.cuit })]),
      );
    });

    it('debería lanzar error si el CUIT ya existe', async () => {
      companiesRepo.findAll.mockResolvedValue([
        {
          id: '1',
          cuit: '30700000001',
          razonSocial: 'Ya existe',
          tipo: 'PYME',
          fechaAdhesion: '2025-07-20T00:00:00.000Z',
        },
      ]);

      const dto: CreateCompanyDto = {
        cuit: '30700000001',
        razonSocial: 'Empresa Test',
        tipo: 'PYME',
        fechaAdhesion: new Date('2025-07-20T00:00:00.000Z'),
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findJoinedLastMonth', () => {
    it('debería devolver empresas adheridas en el último mes', async () => {
      const now = new Date();
      const lastMonth = new Date();
      lastMonth.setMonth(now.getMonth() - 1);

      companiesRepo.findAll.mockResolvedValue([
        {
          id: '1',
          cuit: '30700000001',
          razonSocial: 'Reciente',
          tipo: 'PYME',
          fechaAdhesion: now.toISOString(),
        },
        {
          id: '2',
          cuit: '30700000002',
          razonSocial: 'Vieja',
          tipo: 'PYME',
          fechaAdhesion: '2024-01-01T00:00:00.000Z',
        },
      ]);

      const result = await service.findJoinedLastMonth();
      expect(result).toHaveLength(1);
      expect(result[0].razonSocial).toBe('Reciente');
    });
  });

  describe('findWithTransfersLastMonth', () => {
    it('debería devolver empresas con transferencias en el último mes', async () => {
      const now = new Date().toISOString();
      companiesRepo.findAll.mockResolvedValue([
        {
          id: '1',
          cuit: '30700000001',
          razonSocial: 'Con transfer',
          tipo: 'PYME',
          fechaAdhesion: now,
        },
        {
          id: '2',
          cuit: '30700000002',
          razonSocial: 'Sin transfer',
          tipo: 'PYME',
          fechaAdhesion: now,
        },
      ]);

      transfersRepo.findAll.mockResolvedValue([
        {
          id: 't1',
          empresaId: '1',
          importe: 1000,
          cuentaDebito: '000',
          cuentaCredito: '111',
          fecha: now,
        },
      ]);

      const result = await service.findWithTransfersLastMonth();
      expect(result).toHaveLength(1);
      expect(result[0].razonSocial).toBe('Con transfer');
    });
  });
});
