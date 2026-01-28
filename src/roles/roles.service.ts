import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepo.find({ order: { name: 'ASC' } });
  }

  async findByName(name: string): Promise<Role | null> {
    return this.roleRepo.findOne({ where: { name } });
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async create(name: string): Promise<Role> {
    const existing = await this.findByName(name);
    if (existing) throw new ConflictException('Role already exists');
    const role = this.roleRepo.create({ name });
    return this.roleRepo.save(role);
  }

  async update(id: string, name: string): Promise<Role> {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');
    role.name = name ?? role.name;
    return this.roleRepo.save(role);
  }

  async remove(id: string): Promise<{ message: string }> {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');
    await this.roleRepo.remove(role);
    return { message: 'Role deleted successfully' };
  }
}
