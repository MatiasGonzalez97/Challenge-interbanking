import { IsDate, IsIn, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @Matches(/^\d{11}$/, { message: 'CUIT invalid, should have 11 digits' })
  cuit: string;

  @IsString()
  @IsNotEmpty()
  razonSocial: string;

  @IsNotEmpty()
  @IsIn(['PYME', 'CORPORATIVA'])
  tipo: 'PYME' | 'CORPORATIVA';

  @IsString()
  @IsNotEmpty()
  fechaAdhesion: Date;
}
