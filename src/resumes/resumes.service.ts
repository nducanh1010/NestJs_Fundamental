import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateResumeDto, CreateUserCvDTO} from './dto/create-resume.dto';
import {UpdateResumeDto} from './dto/update-resume.dto';
import {Resume, ResumeDocument} from "./schemas/resume.schema";
import {SoftDeleteModel} from "soft-delete-plugin-mongoose";
import {InjectModel} from "@nestjs/mongoose";
import mongoose from "mongoose";
import {IUser} from "../users/user.interface";

@Injectable()
export class ResumesService {
    constructor(
        @InjectModel(Resume.name)
        private resumeModel: SoftDeleteModel<ResumeDocument>
    ) {
    }

    async create(createUserCvDTO: CreateUserCvDTO, user: IUser) {
        const {url, jobId, companyId} = createUserCvDTO
        const {email, _id} = user
        const newCv = await this.resumeModel.create({
            url, companyId, email, jobId,
            userId: _id,
            status: "PENDING",
            createdBy: {_id, email},
            history: [
                {
                    status: "PENDING",
                    updatedAt: new Date,
                    updatedBy: {
                        _id: user._id, email: user.email
                    }
                }
            ]
        })
        return {
            _id: newCv?._id,
            createdAt: newCv?.createdAt
        };

    }

    findAll() {
        return `This action returns all resumes`;
    }

    async findOne(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw  new BadRequestException(`not found resume with id ${id}`)
        }
        return this.resumeModel.findById(id)
    }

    async update(_id: string, status:string,user:IUser) {
     if(mongoose.Types.ObjectId.isValid(_id)){
         throw new BadRequestException(('Resume not found'))
     }
     const updated= await  this.resumeModel.updateOne(
         {_id},
         {
             status,
             updatedBy:{
                 _id:user._id,
                 email:user.email
             }
         }
     )
    }

    remove(id: number) {
        return `This action removes a #${id} resume`;
    }
}
