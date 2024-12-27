import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Customer } from '../database/models/customer.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

  constructor(@InjectModel(Customer.name) private customerModel: Model<Customer>, private configService: ConfigService) {}

  secretKey = this.configService.get<string>('SECRET_KEY');
  
  signin(req, res, next) {
    let token;
    let validTokens;
    let expirationTime = { expiresIn: 8 * 60 * 60 };
    this.customerModel.findOne({
        email: req.body.email.toLowerCase(),
    })
    .then(async (customer) => {
        if (!customer)
        {
          const exception = new HttpException('Invalid email or password.', HttpStatus.UNAUTHORIZED);
          throw exception;
        }
        if (bcrypt.compareSync(req.body.password, customer.password)) {
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
          res.status(200).json({ firstName: customer.firstName, lastName: customer.lastName, phoneNumber: customer.phoneNumber, token, expirationTime: Number(expirationTime.expiresIn) });
        } else {
          const exception = new HttpException('Invalid email or password.', HttpStatus.UNAUTHORIZED);
          throw exception;
        }
    })
    .catch((exception) => next(exception));
  }

  signout(req, res, next) {
    try {
      const token = req.get("authorization").split(" ")[1];
      this.customerModel.findOneAndUpdate(
        { _id: req.decodedToken.id },
        { $pull: { tokens: token } }
      )
      .then((customer) => {
        res.status(200).json({ message: "signed out" });
      })
      .catch((error) => next(error));
    } catch (error) {
      next(error);
    }
  }

}
