import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) // tiêm được vào mongoose
    private userModel: Model<User>, // ép kiểu giá trị là 1 Model của mongoose
  ) {}
  gethashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash: string = hashSync(password, salt);
    return hash;
  };

  async create(
    // email: string, password: string, name: string
    createUserDto: CreateUserDto,
  ) {
    const hashPassword = this.gethashPassword(createUserDto.password);
    let user = await this.userModel.create({
      email: createUserDto.email,
      password: hashPassword,
      name: createUserDto.name,
      address: createUserDto.address,
    }); // chú ý yêu cầu { } truyền vào như 1 object
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user';
    return this.userModel.findOne({
      _id: id,
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
