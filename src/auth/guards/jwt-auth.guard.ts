import {
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { RevokedToken } from '../entities/revoked-token.entity';
  
  @Injectable()
  export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
      @InjectRepository(RevokedToken)
      private revokedTokenRepo: Repository<RevokedToken>,
    ) {
      super();
    }
  
    async canActivate(context) {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization?.split(' ')[1];
  
      const revoked = await this.revokedTokenRepo.findOne({
        where: { token },
      });
  
      if (revoked) {
        throw new UnauthorizedException('Token revoked');
      }
  
      return super.canActivate(context);
    }
  }
  