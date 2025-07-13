import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user ?? undefined;
  }

  async create(email: string, password: string, firstName: string, lastName: string): Promise<User> {
    const user = this.usersRepository.create({ email, password, firstName, lastName, profile: null });
    return this.usersRepository.save(user);
  }
}
