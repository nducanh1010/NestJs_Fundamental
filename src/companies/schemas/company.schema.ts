import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { type } from 'os';

export type CompanyDocument = HydratedDocument<Company>; // tham chiếu xuống mongo db tạo ra table

@Schema({timestamps:true})
export class Company {
  @Prop() // validate
  name: string;
  @Prop()
  adress: string;
  @Prop()
  description: string;
  @Prop({type:Object})
  createdBy: {
    _id:mongoose.Schema.Types.ObjectId;
    email:string
  };
  @Prop({type:Object})
  updatedBy: {
    _id:mongoose.Schema.Types.ObjectId;
    email:string
  };
  @Prop({type:Object})
  deletedBy: {
    _id:mongoose.Schema.Types.ObjectId;
    email:string
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

export const CompanySchema = SchemaFactory.createForClass(Company);
