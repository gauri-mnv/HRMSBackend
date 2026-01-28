import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { HttpCode, HttpStatus } from '@nestjs/common';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: SignupDto) {
    await this.authService.signup(dto.email, dto.password, dto.roleName);
    return {
      message: 'Signup successful',
    };
  }
  // @Post('signup')
  // signup(@Body() dto: SignupDto) {
  //   return this.authService.signup(dto.email, dto.password, dto.roleName);
  // }

  //we can also create a signin method
  // @Post('signin')
  // async signin(@Body() dto: SigninDto) {
  //   return this.authService.signin(dto.email, dto.password);
  // }
  @Post('signin')
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto.email, dto.password);
  }
  @UseGuards(JwtAuthGuard)
  @Get('emp')
  getProfile(@Req() req: any) {
    return req.user;
  }
  // @UseGuards(JwtAuthGuard)
  // @Post('logout')
  // @UseGuards(AuthGuard('jwt'))
  // async logout(@Req() req: Request) {
  //   const authHeader = req.headers['authorization'];
  //   if (!authHeader) {
  //     throw new UnauthorizedException('Authorization header missing');
  //   }

  //   const token = authHeader.split(" ")[1]; 
  //   return this.authService.logout(token);
  //}

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return;

    const token = authHeader.split(' ')[1];
    return this.authService.logout(token);
  }

  @Post('refresh')
  refresh(@Body('refresh_token') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @Patch('cng-pass')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @Req() req: any,
    @Body('old_password') oldPassword: string,
    @Body('new_password') newPassword: string,
  ) {
    return this.authService.changePassword(
      req.user.userId,
      oldPassword,
      newPassword,
    );
  }

}
