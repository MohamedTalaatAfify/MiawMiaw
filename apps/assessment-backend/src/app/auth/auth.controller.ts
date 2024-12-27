import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Next, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  signin(@Req() req, @Res() res, @Next() next) {
    this.authService.signin(req, res, next);
  }

  @Post('/signout')
  signout(@Req() req, @Res() res, @Next() next) {
    this.authService.signout(req, res, next);
  }
}
