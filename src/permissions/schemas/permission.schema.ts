import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {HydratedDocument} from "mongoose";
import {Job} from "../../jobs/schemas/job.schema";
export type PermissionDocument = HydratedDocument<Permission>; // tham chiếu xuống mongo db tạo ra table

@Schema({timestamps:true})

export class Permission {
    @Prop()
    name:string
    @Prop()
    apiPath:string
    @Prop()
    method:string
    @Prop()
    module:string  // thuộc module nào
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
export const PermissionSchema =SchemaFactory.createForClass(Permission)
