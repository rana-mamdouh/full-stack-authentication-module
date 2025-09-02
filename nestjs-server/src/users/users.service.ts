import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { SignupDto } from '../auth/dto/signup.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async create(signupDto: SignupDto): Promise<UserDocument> {
        const { email, name, password } = signupDto;

        const existingUser = await this.userModel.findOne({ email }).exec();
        if (existingUser) {
            throw new ConflictException('User already exists with this email');
        }

        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new this.userModel({
            email,
            name,
            password: hashedPassword,
        });

        return newUser.save();
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findById(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).select('-password').exec();
    }

    async validatePassword(user: UserDocument, password: string): Promise<boolean> {
        return bcrypt.compare(password, user.password);
    }
}