import { forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { EmployeeService } from 'src/employee/employee.service';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UsersService {
  // constructor(
  //   @InjectRepository(User)
  //   private readonly userRepo: Repository<User>,
  // ) {}
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @Inject(forwardRef(() => AuthService)) 
    private authService: AuthService,

    @Inject(forwardRef(() => EmployeeService)) // Index [2] that was causing the '?' error
    private  employeeService: EmployeeService,

    @Inject(forwardRef(() => RolesService)) 
    private  rolesService: RolesService,

    // @Inject(forwardRef(() => UsersService))
    // private usersService: UsersService,

    // @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
   
  ) {}
  async findAll() {
    // const users = await this.userRepo.find({
    //   relations: ['role'], // fetch related role
    //   order: { email: 'ASC' }, // optional: order by email
    // });
  
    // // map to safe format if you don’t want passwords etc.
    // return users.map((u) => ({
    //   id: u.id,
    //   email: u.email,
    //   role: u.role ? { id: u.role.id, name: u.role.name } : null,
    // }));

    return this.findAllSafe();
  }
  findOne(id: string) {
    throw new Error('Method not implemented.');
  }
  remove(id: string) {
    throw new Error('Method not implemented.');
  }
  update(id: string, dto: UpdateUserDto) {
    throw new Error('Method not implemented.');
  }
  create(dto: CreateUserDto) {
    throw new Error('Method not implemented.');
  }
  userRepository: any;


 
  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }
  /**
   * Finds a user by email.
   * @param {string} email
   * @returns {Promise<User>} The user found.
   */


  // async getUserByEmail(email: string): Promise<User | null> {
  //   const user = await this.userRepo.findOne({ where: { email } });

  //   return user || null;
  // }

  async getUserByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findAllSafe() {
    const users = await this.userRepo.find({
      relations: ['role'],
      order: { email: 'ASC' },
    });
     //console.log("users data",users);   
    return users.map((u) => ({
      id: u.id,
      email: u.email,
      role: u.role ? { id: u.role.id, name: u.role.name } : null,
    }));
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const userEntity = this.userRepository.create(createUserDto);
    return this.userRepository.save(userEntity);
  }
  

  async findOneById(id: string): Promise<User> {
    const foundUser = await this.findById(id);

    if (!foundUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return foundUser;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.findOneById(id);

    const updatedUser = {
      ...existingUser,
      ...updateUserDto,
    };

    return this.userRepo.save(updatedUser);
  }
  async removeUser(id: string): Promise<void> {
    const foundUser = await this.userRepo.findOne({ where: { id } }).catch(() => {
      throw new NotFoundException(`User with id ${id} not found`);
    });

    if (!foundUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    try {
      await this.userRepo.remove(foundUser);
    } catch (error) {
      throw new InternalServerErrorException(`Error removing user with id ${id}`);
    }
  }
  // async findOneById(id: string): Promise<User> {
  //   const user = await this.userRepo.findOne({ where: { id } });

  //   if (!user) {
  //     throw new NotFoundException(`User with id ${id} not found`);
  //   }

  //   return user;
  // }
}

