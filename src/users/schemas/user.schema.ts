import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>; // tham chiếu xuống mongo db tạo ra table

@Schema()
export class User {
  @Prop({ required: true }) // validate
  email: string;

  @Prop({ required: true })
  password: number;
  @Prop()
  phone: string;
  @Prop()
  name: string;
  @Prop()
  age: number;
  @Prop()
  adress: string;
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
