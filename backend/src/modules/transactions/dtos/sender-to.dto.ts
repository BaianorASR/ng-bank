import {
  IsDecimal,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';

export class SendToDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsDecimal()
  @IsNumberString()
  @IsNotEmpty()
  value: string;
}
