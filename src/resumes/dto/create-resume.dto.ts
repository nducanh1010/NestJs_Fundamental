import {IsMongoId, IsNotEmpty} from "class-validator";
import mongoose from "mongoose";

export class CreateResumeDto {
    @IsNotEmpty({message: 'Email không được để trống'})
    email: string;
    @IsNotEmpty({message: 'userId không được để trống'})
    userId: mongoose.Schema.Types.ObjectId;
    @IsNotEmpty({message: 'url không được để trống'})
    url: string;
    @IsNotEmpty({message: 'status không được để trống'})
    status: string;
    @IsNotEmpty({message: 'companyId không được để trống'})
    companyId: mongoose.Schema.Types.ObjectId;
    @IsNotEmpty({message: 'jobId không được để trống'})
    jobId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserCvDTO {
    @IsNotEmpty({message: 'url không được để trống'})
    url: string;
    @IsNotEmpty({message: 'companyId không được để trống'})
    @IsMongoId({message: 'company must be a mongo id'})
    companyId: mongoose.Schema.Types.ObjectId;
    @IsNotEmpty({message: 'jobId không được để trống'})
    @IsMongoId({message: 'jobId must be a mongo id'})
    jobId: mongoose.Schema.Types.ObjectId;

}
