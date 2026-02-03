import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service'; 
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { EmployeeModule } from './employee/employee.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import {TypeOrmModule} from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { DepartmentModule } from './department/department.module';
import { AttendanceModule } from './attendance/attendance.module';
import { LeavesModule } from './leave/leaves.module';
import { PayrollModule } from './payroll/payroll.module';

@Module({

  imports: [
    AuthModule,
    RolesModule,
    EmployeeModule,
    UsersModule,
    DepartmentModule,
    AttendanceModule,
    LeavesModule,
    PayrollModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),

        autoLoadEntities: true,
        synchronize: true, 
        // logging: true,
      }),
    }),
  
  ],
  controllers: [AppController],
  providers: [
    AppService ,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule {}
