import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriberDto {
    @IsNotEmpty({message:'Name khoông được để trống'})
    name:string;
    @IsNotEmpty({message:'Email khoông được để trống'})
    @IsEmail({},{message:'Email không đúng định dạng'})
    email:string
    @IsNotEmpty({message:'Skills khoông được để trống'})
    @IsArray({message:'Skills có định dạng là mảng'})
    @IsString({each:true,message:'Skills định dạng là string'})
    skills:string[]

}
