import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { Role } from 'src/roles/role.entity';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  forwardRef(() => EmployeeModule),
  forwardRef(() => AuthModule),
      ],
  controllers: [UsersController],
  providers: [UsersService,
    {
      provide: 'UserRepository',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
      inject: [DataSource],
    },
  ],
  // exports: [UsersService, TypeOrmModule],
  exports: [UsersService,'UserRepository'],
})
export class UsersModule {}

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([User]),
//     AuthModule, // ✅ ADD THIS
//   ],
//   controllers: [UsersController],
//   providers: [UsersService],
// })
// export class UsersModule {}