import {
  IsDecimal,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';

export class SendCashInToDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsDecimal({ decimal_digits: '2' })
  @IsNumberString()
  @IsNotEmpty()
  amount: string;
}
