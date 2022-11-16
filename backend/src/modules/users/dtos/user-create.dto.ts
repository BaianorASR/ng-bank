import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class UserCreateDto {
  @Transform(({ value }) => value.trim().toLowerCase())
  @IsNotEmpty()
  @IsString()
  @Length(3, 60)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  password: string;
}
