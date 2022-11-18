import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { InternalServerErrorException } from '@nestjs/common';

import { Account } from './account.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Index()
  username: string;

  @Column({ select: false })
  password: string;

  @OneToOne(() => Account, (account) => account.user, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
    createForeignKeyConstraints: true,
  })
  @JoinColumn()
  account: Account;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;

  @BeforeInsert()
  private async setLowercaseUsername(): Promise<void> {
    this.username = this.username.toLowerCase();
  }

  @BeforeInsert()
  private async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (e) {
      throw new InternalServerErrorException(
        'There are some issues in the hash',
      );
    }
  }
}
