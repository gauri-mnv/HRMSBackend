import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  findById(id: any) {
    return this.userRepo.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
    
  }

  async findAllSafe() {
    const users = await this.userRepo.find({
      relations: ['role'],
      order: { email: 'ASC' },
    });

    // Never return passwords to the client.
    return users.map((u) => ({
      id: u.id,
      email: u.email,
      role: u.role ? { id: u.role.id, name: u.role.name } : null,
    }));
  }
}

