import { Controller, Post,Req,
  UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}


  @Post('signup')
  signup(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('role') role: string,
  ) {
    return this.authService.signup(email, password, role);
  }

  //we can also create a signin method
  // @Post('signin')
  // async signin(@Body() dto: SigninDto) {
  //   return this.authService.signin(dto.email, dto.password);
  // }
  @Post('signin')
  signin(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.signin(email, password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    return this.authService.logout(token);
  }

}
