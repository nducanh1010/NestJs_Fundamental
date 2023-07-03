import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserM, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './user.interface';
import { User } from 'src/decorator/customize';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserM.name) // tiêm được vào mongoose
    private userModel: SoftDeleteModel<UserDocument>, // ép kiểu giá trị là 1 Model của mongoose. soft delete là xóa mềm, hox trợ khôi phục
  ) {}
  gethashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash: string = hashSync(password, salt);
    return hash;
  };

  async create(
    // email: string, password: string, name: string
    createUserDto: CreateUserDto,
    @User() user: IUser,
  ) {
    const { address, age, company, email, gender, name, password, role } =
      createUserDto;
    const hashPassword = this.gethashPassword(password);
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(
        `Email  ${email} đã tồn tại, vui lòng sử dụng email khác !`,
      );
    }
    let userNew = await this.userModel.create({
      email,
      password: hashPassword,
      name,
      address,
      age,
      company,
      gender,
      role,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    }); // chú ý yêu cầu { } truyền vào như 1 object
    return userNew;
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
  findOneByUserName(username: string) {
    return this.userModel.findOne({
      email: username,
    });
  }
  IsValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }
  async update(updateUserDto: UpdateUserDto, @User() user: IUser) {
    console.log('update user dto', updateUserDto);

    const updatedUser = await this.userModel.updateOne(
      {
        _id: updateUserDto._id, // filter user by id
      },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      }, // update data từ request body truyền vào
    );
    return updatedUser;
  }

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user';
    return this.userModel.softDelete({ _id: id });
  }
  async register(user: RegisterUserDto) {
    const { address, age, email, gender, name, password } = user;
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(
        `Email  ${email} đã tồn tại, vui lòng sử dụng email khác !`,
      );
    }
    const hashPassword = this.gethashPassword(password);
    let newRegister = await this.userModel.create({
      name,
      email,
      age,
      address,
      gender,
      role: 'USER',
      password: hashPassword,
    });
    return newRegister;
  }
}
