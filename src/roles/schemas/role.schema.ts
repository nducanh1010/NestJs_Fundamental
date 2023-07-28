import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Permission } from '../../permissions/schemas/permission.schema';
export type RoleDocument = HydratedDocument<Role>; // tham chiếu xuống mongo db tạo ra table
@Schema({ timestamps: true })
export class Role {
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  isActive: boolean;
  // để sử dụng array đối tượng, cần khai báo kiểu type trong []
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Permission.name })
  permissions: Permission[];
  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
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
export const RoleSchema = SchemaFactory.createForClass(Role);
