import { HttpException, HttpStatus, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from '../database/models/customer.schema';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

    constructor(@InjectModel(Customer.name) private customerModel: Model<Customer>) {}

    async use(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authHeader = req.get('authorization');
            if (!authHeader) throw new HttpException('Authorization header missing.', HttpStatus.UNAUTHORIZED);

            const token = authHeader.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY) as jwt.JwtPayload;

            const customer = await this.customerModel.findOne({ _id: decodedToken.id, deleted: false });
            if (!customer || !customer.tokens?.includes(token)) throw new HttpException('Invalid token.', HttpStatus.UNAUTHORIZED);
            req['decodedToken'] = decodedToken;
            next();
        } catch (exception) {
            next(exception);
        }
    }
}
