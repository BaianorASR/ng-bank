import { CurrentUser } from '@decorators/current-user.decorator';
import { PaginationParams } from '@decorators/pagination-params.decorator';
import { ICurrentUser } from '@interfaces/current-user.interface';
import { IPaginationOptions } from '@interfaces/pagination-params.interface';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ParsePaginationParamsPipe } from 'src/pipes/pagination-params.pipe';
import { SendCashInToDto } from './dtos/sender-to.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getTransactions(
    @CurrentUser() currentUser: ICurrentUser,
    @PaginationParams(new ParsePaginationParamsPipe())
    paginationOptions: IPaginationOptions,
  ) {
    return this.transactionsService.getTransactions(
      currentUser,
      paginationOptions,
    );
  }

  @Post('create')
  async createTransaction(
    @Body() sendCashInToDto: SendCashInToDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.transactionsService.cashIn(sendCashInToDto, currentUser);
  }
}
