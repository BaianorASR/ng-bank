import { IPaginationOptions } from '@interfaces/pagination-params.interface';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const PaginationParams = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IPaginationOptions => {
    const request = ctx.switchToHttp().getRequest();
    const { page, limit, sort, order, startDate, endDate } = request.query;

    return {
      page,
      limit,
      sort,
      order,
      startDate,
      endDate,
    };
  },
);
