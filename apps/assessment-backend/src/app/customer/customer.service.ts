import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Customer } from '../database/models/customer.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class CustomerService {

  constructor(@InjectModel(Customer.name) private customerModel: Model<Customer>, private configService: ConfigService) {}

  secretKey = this.configService.get<string>('SECRET_KEY');

  signup(req, res, next) {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    const customer = new this.customerModel({
      firstName: firstName,
      lastName: lastName,
      email: email.toLowerCase(),
      password: password,
      phoneNumber: phoneNumber,
    });
    let token;
    let validTokens;
    let expirationTime = { expiresIn: 8 * 60 * 60 };
    customer
    .save()
    .then(async (customer) => {
      token = jwt.sign(
        {
          email: customer.email,
          id: customer._id,
          role: "customer",
        },
        this.secretKey,
        expirationTime
      );
        validTokens = customer.tokens || [];
        validTokens = validTokens.filter((t) => {
            try
            {
              jwt.verify(t, this.secretKey);
              return true;
            } catch (error)
            {
                return false;
            }
        });
        await this.customerModel.findByIdAndUpdate(customer._id, {
          tokens: [...validTokens, token],
        });
        res.status(200).json({ firstName:customer.firstName, lastName: customer.lastName, phoneNumber: customer.phoneNumber, email: customer.email, token, expirationTime: Number(expirationTime.expiresIn) });
      })
      .catch((error) => {
        if (error.code == 11000) {
          const exception = new HttpException('User already exists.', HttpStatus.CONFLICT);
          next(exception);
        } else {
          next(error);
        }
      });
  }
}
