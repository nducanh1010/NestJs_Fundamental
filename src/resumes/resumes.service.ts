import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeDto, CreateUserCvDTO } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { IUser } from '../users/user.interface';
import aqp from 'api-query-params';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>,
  ) {}

  async create(createUserCvDTO: CreateUserCvDTO, user: IUser) {
    const { url, jobId, companyId } = createUserCvDTO;
    const { email, _id } = user;
    const newCv = await this.resumeModel.create({
      url,
      companyId,
      email,
      jobId,
      userId: _id,
      status: 'PENDING',
      createdBy: { _id, email },
      history: [
        {
          status: 'PENDING',
          updatedAt: new Date(),
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      ],
    });
    return {
      _id: newCv?._id,
      createdAt: newCv?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * +limit; // bỏ qua bao nhiêu bản ghi
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit); // tổng số trang
    const result = await this.resumeModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population) // join bảng
      .exec();
    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found resume with id ${id}`);
    }
    return this.resumeModel.findById(id);
  }

  async update(_id: string, status: string, user: IUser) {
    if (mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Resume not found');
    }
    // trường hợp tìm ok sẽ update
    const updated = await this.resumeModel.updateOne(
      { _id },
      {
        status,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
        // đẩy thêm data vào data cũ
        $push: {
          history: {
            status: status,
            updatedAt: new Date(),
            updatedBy: {
              _id: user._id,
              email: user.email,
            },
          },
        },
      },
    );
    return updated;
  }

  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return 'resume not found';
    }
    // tìm bằng id, (2 tham số )  deleted bởi ai
    await this.resumeModel.updateOne(
      { _id:_id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.resumeModel.softDelete({ _id });
  }
  async findByUsers(user:IUser){
    return await this.resumeModel.find({
      userIdl:user._id
    })
  }
}
