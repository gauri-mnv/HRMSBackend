import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';
import { RevokedToken } from '../../auth/revoked-token.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    @InjectRepository(RevokedToken)
    private readonly revokedTokenRepo: Repository<RevokedToken>,
    @InjectRepository(User)
    private userRepo: Repository<User>,

   
    // @InjectRepository(RevokedToken) private revokedRepo: Repository<RevokedToken>,
    // @InjectRepository(User) private userRepo: Repository<User>,
  ) {
    super();
  }

  // canActivate(
  //   context: ExecutionContext,
  // ): boolean | Promise<boolean> {
  //   const request = context.switchToHttp().getRequest();
  //   const authHeader = request.headers.authorization;

  //   if (!authHeader) {
  //     throw new UnauthorizedException('Authorization header missing');
  //   }

  //   const token = authHeader.split(' ')[1];

  //   return (async () => {
  //     const hashed = createHash('sha256').update(token).digest('hex');
  //     const revoked = await this.revokedTokenRepo.findOne({
  //       where: { token: hashed },
  //     });

  //     if (revoked) {
  //       throw new UnauthorizedException('Token revoked');
  //     }
  //     return super.canActivate(context) as Promise<boolean>;
  //   })();
  //}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
  
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }
    // const user = await this.usersService.findById(user_id);
    const token = authHeader.split(' ')[1];
    const hashed = createHash('sha256').update(token).digest('hex');
    const revoked = await this.revokedTokenRepo.findOne({
      where: { token: hashed },
    });
  
    if (revoked) {
      throw new UnauthorizedException('Token revoked');
    }
    const isValid = (await super.canActivate(context)) as boolean;
  if (!isValid) return false;

  // 3 Now user is available
  const user = request.user; // <-- comes from JwtStrategy

  if (!user) {
    throw new UnauthorizedException('Invalid token');
  }
else {
  console.log(user);
  request.user = user;
    return true;

}
  
    return super.canActivate(context) as Promise<boolean>;
  }
  

}
 