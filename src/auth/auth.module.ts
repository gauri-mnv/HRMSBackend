
import { DataSource } from 'typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/role.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RevokedToken } from './revoked-token.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { EmployeeModule } from 'src/employee/employee.module';
import { UsersModule } from 'src/users/users.module';
import { Employee } from 'src/employee/employee.entity';

// const expiresIn =config.get<string>('JWT_EXPIRES_IN') ?? '1w';

// @Module({
//   imports: [
//     PassportModule.register({ defaultStrategy: 'jwt' }),
//     TypeOrmModule.forFeature([User, Role, RevokedToken,Employee ]),
//     ConfigModule.forRoot({
//       isGlobal: true,
//       envFilePath: '.env',
//     }),
//     // JwtModule.register({
//     //   secret:jwtConfig.secret,
//     //   signOptions: {
//     //     expiresIn: jwtConfig.expiresIn,
//     //   },
//     // }),
  
//     JwtModule.register({
//       // imports: [ConfigModule.forRoot({ isGlobal: true }),],
//       // inject: [ConfigService],
//       // useFactory: (config: ConfigService) => ({
//       //   secret: config.get<string>('JWT_SECRET')!,
//       //   signOptions: {
//       //     expiresIn:config.get<any>('JWT_EXPIRES_IN') ,
//       //   },
//       // }),
//       secret: process.env.JWT_SECRET ||'secretkey',
//       signOptions: { expiresIn: '1d' },

//     }),

//     // forwardRef(() => EmployeeModule),
//     //     UsersModule,
   
//   ],
//   controllers: [AuthController],
//   providers: [AuthService, JwtStrategy, JwtAuthGuard],
//   // exports: [JwtModule,PassportModule],
//   exports: [JwtModule, PassportModule, JwtAuthGuard,AuthService],

// })
// export class AuthModule {}
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User, Role,Employee, RevokedToken]),
    forwardRef(() => EmployeeModule),
    forwardRef(() => UsersModule),
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretkey',
      signOptions: { expiresIn: '1d' },
    }),
   
  ],
  controllers: [AuthController],
  providers: [AuthService, 
              JwtStrategy, 
              JwtAuthGuard,
              {
                provide: 'RevokedTokenRepository',
                useFactory: (dataSource: DataSource) => dataSource.getRepository(RevokedToken),
                inject: [DataSource],
              },
            
            ],
  exports: [JwtModule, 
            PassportModule, 
            JwtAuthGuard, 
            AuthService,
            'RevokedTokenRepository'
            ],
})
export class AuthModule {}