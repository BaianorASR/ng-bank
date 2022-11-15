import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Account } from './account.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Account)
  @JoinColumn()
  debitedAccount: Account;

  @OneToOne(() => Account)
  @JoinColumn()
  creditedAccount: Account;

  @Column({ type: 'decimal', scale: 2, precision: 10 })
  value: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
