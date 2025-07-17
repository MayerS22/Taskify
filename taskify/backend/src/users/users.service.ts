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

  async updateProfile(userId: number, update: { firstName?: string; lastName?: string; bio?: string; phone?: string; profile?: string; country?: string }): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    if (update.firstName !== undefined) user.firstName = update.firstName;
    if (update.lastName !== undefined) user.lastName = update.lastName;
    if (update.bio !== undefined) user.bio = update.bio;
    if (update.phone !== undefined) user.phone = update.phone;
    if (update.profile !== undefined) user.profile = update.profile;
    if (update.country !== undefined) user.country = update.country;
    return this.usersRepository.save(user);
  }
}
