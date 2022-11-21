import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

enum PaginationOptionsOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface IPaginationOptions {
  page: number;
  limit: number;
  sort: string;
  order: PaginationOptionsOrder;
  startDate: Date;
  endDate: Date;
}

export class PaginationOptionsDto implements IPaginationOptions {
  @IsInt()
  @IsOptional()
  page: number = 1;

  @IsInt()
  @IsOptional()
  limit: number = 25;

  @IsString()
  @IsOptional()
  sort: string = 'id';

  @IsEnum(PaginationOptionsOrder)
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toUpperCase())
  order: PaginationOptionsOrder = PaginationOptionsOrder.ASC;

  @IsDate()
  @IsOptional()
  startDate: Date = new Date(0);

  @IsDate()
  @IsOptional()
  endDate: Date = new Date();
}
