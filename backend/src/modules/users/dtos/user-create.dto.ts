import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 60)
  @Transform(({ value }) => value.trim().toLowerCase())
  username: string;

  @Matches(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{8,}$'), {
    message: `Password must contain at least one uppercase letter, one lowercase letter, one number and must be at least 8 characters long`,
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  password: string;
}
