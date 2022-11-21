/* eslint-disable @typescript-eslint/ban-types */
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import {
  IPaginationOptions,
  PaginationOptionsDto,
} from '@interfaces/pagination-params.interface';
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParsePaginationParamsPipe
  implements PipeTransform<IPaginationOptions, Promise<PaginationOptionsDto>>
{
  async transform(
    value: IPaginationOptions,
    _metadata: ArgumentMetadata,
  ): Promise<PaginationOptionsDto> {
    const object: PaginationOptionsDto = plainToInstance(
      PaginationOptionsDto,
      value,
      {
        exposeDefaultValues: true,
        enableImplicitConversion: true,
      },
    );

    const errors = await validate(object);

    if (errors.length > 0) {
      const errorMessage: string[] = [];

      errors.forEach((error): void => {
        errorMessage.push(Object.values(error.constraints).join());
      });

      throw new BadRequestException(errorMessage, 'Params validation failed');
    }

    return object;
  }
}
