/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TransfersService } from '../transfers.service';
import { TransfersRepository } from '../transfers.repository';
import { CreateTransferDto } from '../dto/create-transfer.dto';

describe('TransfersService', () => {
  let service: TransfersService;
  let transfersRepo: jest.Mocked<TransfersRepository>;

  beforeEach(() => {
    transfersRepo = {
      findAll: jest.fn(),
      saveAll: jest.fn(),
    } as any;

    service = new TransfersService(transfersRepo);
  });

  describe('findAll', () => {
    it('debería devolver todas las transferencias', async () => {
      const mockTransfers = [
        {
          id: 't1',
          empresaId: '1',
          importe: 1000,
          cuentaDebito: '0000000000000000000001',
          cuentaCredito: '0000000000000000000002',
          fecha: new Date().toISOString(),
        },
      ];

      transfersRepo.findAll.mockResolvedValue(mockTransfers);

      const result = await service.findAll();
      expect(result).toEqual(mockTransfers);
      expect(transfersRepo.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('debería crear una nueva transferencia', async () => {
      transfersRepo.findAll.mockResolvedValue([]);
      transfersRepo.saveAll.mockResolvedValue(undefined);

      const dto: CreateTransferDto = {
        empresaId: '1',
        importe: 1500,
        cuentaDebito: '0000000000000000000001',
        cuentaCredito: '0000000000000000000002',
      };

      const result = await service.create(dto);

      expect(result.empresaId).toBe(dto.empresaId);
      expect(result.importe).toBe(dto.importe);
      expect(result.cuentaDebito).toBe(dto.cuentaDebito);
      expect(result.cuentaCredito).toBe(dto.cuentaCredito);
      expect(transfersRepo.saveAll).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ empresaId: dto.empresaId }),
        ]),
      );
    });
  });
});
