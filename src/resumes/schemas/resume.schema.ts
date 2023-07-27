import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose, {HydratedDocument} from 'mongoose';
import { Company } from 'src/companies/schemas/company.schema';
import { Job } from 'src/jobs/schemas/job.schema';
export type ResumeDocument = HydratedDocument<Resume>; // tham chiếu xuống mongo db tạo ra table
@Schema({timestamps: true}) // timestamp nói cho mongoose biết thời gian ta updatedAt
export class Resume {
    @Prop() // validate
    email: string;
    @Prop()
    userId: mongoose.Schema.Types.ObjectId;
    @Prop()
    url: string;
    @Prop()
    status: string// PENDING-REVIEWING-APPROVED-REJECTED
    @Prop({type:mongoose.Schema.Types.ObjectId, ref: Company.name}) // nói mongoose biết data mapped với company_id có cái gì 
    // giống join bảng lấy thông tin
    companyId: mongoose.Schema.Types.ObjectId;
    @Prop({type:mongoose.Schema.Types.ObjectId, ref: Job.name})
    jobId: mongoose.Schema.Types.ObjectId;
    @Prop({type: mongoose.Schema.Types.Array})
    history:
        //đây là config kiểu array object
        { status: string, updatedAt: Date, updatedBy: { _id, email } }[ ]
    @Prop({type: Object})
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string
    };
    @Prop({type: Object})
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string
    };
    @Prop({type: Object})
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string
    };
    @Prop()
    createdAt: Date;
    @Prop()
    updatedAt: Date;
    @Prop()
    isDeleted: boolean;
    @Prop()
    deletedAt: Date;

}

export const ResumeSchema = SchemaFactory.createForClass(Resume);
