import {Injectable} from '@nestjs/common';
import {CreateJobDto} from './dto/create-job.dto';
import {UpdateJobDto} from './dto/update-job.dto';
import {IUser} from "../users/user.interface";
import {InjectModel} from "@nestjs/mongoose";
import {SoftDeleteModel} from "soft-delete-plugin-mongoose";
import {Job, JobDocument} from "./schemas/job.schema";
import aqp from "api-query-params";
import mongoose from "mongoose";

@Injectable()
export class JobsService {
    constructor(
        @InjectModel(Job.name)
        private jobModel: SoftDeleteModel<JobDocument>,
    ) {
    }

    async create(createJobDto: CreateJobDto, user: IUser) {
        const {
            name,
            skills,
            salary,
            endDate,
            startDate,
            isActive,
            level,
            quantity,
            description,
            company
        } = createJobDto
        let newJob= await this.jobModel.create({
                name, skills, salary, endDate, startDate, isActive,
                quantity, description, company
                , createdBy: {
                    _id: user._id,
                    email: user.email
                }
            }
        )
        return {
            // trả về 2 trường
            _id: newJob?._id,
            createdAt:newJob?.createdAt
        }
    }

    async findAll(currentPage: number, limit: number, qs: string) {
        const {filter, skip, sort, projection, population} = aqp(qs);
        delete filter.current;
        delete filter.pageSize;
        let offset = (+currentPage - 1) * +limit; // bỏ qua bao nhiêu bản ghi
        let defaultLimit = +limit ? +limit : 10;
        const totalItems = (await this.jobModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit); // tổng số trang
        const result = await this.jobModel.find(filter)
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
            return 'Job not found'
        }
        return await this.jobModel.findById(id)
    }

    async update(_id: string, updateJobDto: UpdateJobDto, user: IUser) {
        const updated = await this.jobModel.updateOne(
            {_id}, {
                ...updateJobDto,
                updatedBy: {
                    _id: user._id,
                    email: user.email
                }
            }
        );
        return updated
    }

    async remove(_id: string, user: IUser) {
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return 'job not found'
        }
        // tìm bằng id, (2 tham số )  deleted bởi ai
        await this.jobModel.updateOne({_id}, {
            deletedBy: {
                _id: user._id,
                email: user.email
            }
        })
        return this.jobModel.softDelete({_id})
    }
}
