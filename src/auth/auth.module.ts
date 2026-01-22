import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../config/jwt.config'; 
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RevokedToken } from './entities/revoked-token.entity';


// const expiresIn =config.get<string>('JWT_EXPIRES_IN') ?? '1w';

@Module({
  imports: [

    TypeOrmModule.forFeature([User, Role, RevokedToken]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // JwtModule.register({
    //   secret:jwtConfig.secret,
    //   signOptions: {
    //     expiresIn: jwtConfig.expiresIn,
    //   },
    // }),
  
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET')!,
        signOptions: {
          expiresIn:config.get<any>('JWT_EXPIRES_IN') ,
        },
      }),
    }),


  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
