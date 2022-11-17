import { Account, Transaction, User } from '@database/entities';
import { ICurrentUser } from '@interfaces/current-user.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SendToDto } from './dtos/sender-to.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createTransaction(sendTo: SendToDto, currentUser: ICurrentUser) {
    const queryRunner =
      this.transactionRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const creditedAccount = await this.userRepository.findOne({
        where: { username: sendTo.username },
        relations: ['account'],
      });

      if (!creditedAccount) {
        throw new Error('User to send not found');
      }

      const transaction = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Transaction)
        .values({
          value: sendTo.value,
          creditedAccount: creditedAccount.account,
          debitedAccount: { id: currentUser.userId },
        })
        .execute();

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return transaction;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    }
  }
}
