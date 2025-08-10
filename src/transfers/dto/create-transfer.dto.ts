import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class CreateTransferDto {
  @IsString()
  @IsNotEmpty()
  empresaId: string;

  @IsNumber()
  importe: number;

  @Matches(/^\d{22}$/, { message: 'La cuenta debe tener 22 dígitos' })
  cuentaDebito: string;

  @Matches(/^\d{22}$/, { message: 'La cuenta debe tener 22 dígitos' })
  cuentaCredito: string;
}
