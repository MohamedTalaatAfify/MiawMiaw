import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Next } from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('/signup')
  signup(@Req() req, @Res() res, @Next() next) {
    this.customerService.signup(req, res, next);
  }

}
