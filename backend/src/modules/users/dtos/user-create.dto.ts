import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 60)
  @Transform(({ value }) => value.trim().toLowerCase())
  username: string;

  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, {
    message:
      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter and one number.',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
