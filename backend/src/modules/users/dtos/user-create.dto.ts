import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UserCreateDto {
  @Transform(({ value }) => value.trim().toLowerCase())
  @IsNotEmpty()
  @IsString()
  @Length(3, 60)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 30)
  password: string;
}
