import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>; // tham chiếu xuống mongo db tạo ra table

@Schema({timestamps:true})
export class User {
  @Prop({ required: true }) // validate
  email: string;

  @Prop({ required: true })
  password: string;
  @Prop()
  phone: string;
  @Prop()
  name: string;
  @Prop()
  age: number;
  @Prop()
  address: string;
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
