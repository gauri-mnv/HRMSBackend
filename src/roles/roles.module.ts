import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UsersModule } from "../users/users.module";
import { RevokedToken } from 'src/auth/revoked-token.entity';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role,RevokedToken,User]),
  UsersModule,AuthModule
],

  controllers: [RolesController],
  providers: [RolesService, RolesGuard],
  exports: [TypeOrmModule, RolesService],
})
export class RolesModule {}
