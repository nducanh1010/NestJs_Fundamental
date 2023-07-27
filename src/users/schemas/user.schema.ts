import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from 'src/roles/schemas/role.schema';

export type UserDocument = HydratedDocument<User>; // tham chiếu xuống mongo db tạo ra table

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;
  @Prop({ required: true }) // validate
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop()
  age: number;
  @Prop()
  gender: string;

  @Prop()
  phone: string;
  @Prop({ type: Object })
  company: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
  };
  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  // nói mongoose biết data mapped với company_id có cái gì 
  // giống join bảng lấy thông tin
  @Prop({type:mongoose.Schema.Types.ObjectId, ref: Role.name})
  role: mongoose.Schema.Types.ObjectId;
  @Prop()
  refreshToken: string;
  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
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

export const UserSchema = SchemaFactory.createForClass(User);
