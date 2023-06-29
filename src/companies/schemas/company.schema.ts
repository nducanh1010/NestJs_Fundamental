import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>; // tham chiếu xuống mongo db tạo ra table

@Schema({timestamps:true})
export class Company {
  @Prop() // validate
  name: string;
  @Prop()
  adress: string;
  @Prop()
  description: string;
  @Prop()
  createdBy: {
    _id:string;
    email:string
  };
  @Prop()
  updatedBy: {
    _id:string;
    email:string
  };
  @Prop()
  deletedBy: {
    _id:string;
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
