import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RevokedToken } from './entities/revoked-token.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';


// const expiresIn =config.get<string>('JWT_EXPIRES_IN') ?? '1w';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
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
  
    JwtModule.register({
      // imports: [ConfigModule.forRoot({ isGlobal: true }),],
      // inject: [ConfigService],
      // useFactory: (config: ConfigService) => ({
      //   secret: config.get<string>('JWT_SECRET')!,
      //   signOptions: {
      //     expiresIn:config.get<any>('JWT_EXPIRES_IN') ,
      //   },
      // }),
      secret: process.env.JWT_SECRET || 'secretkey',
      signOptions: { expiresIn: '1d' },

    }),


  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  exports: [JwtModule,PassportModule],
})
export class AuthModule {}
