import { CurrentUser } from '@decorators/current-user.decorator';
import { ICurrentUser } from '@interfaces/current-user.interface';
import { Body, Controller, Post } from '@nestjs/common';
import { SendToDto } from './dtos/sender-to.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('create')
  async createTransaction(
    @Body() senderTo: SendToDto,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.transactionsService.createTransaction(senderTo, currentUser);
  }
}
