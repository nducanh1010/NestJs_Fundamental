import {Injectable} from '@nestjs/common';
import {CreateCompanyDto} from './dto/create-company.dto';
import {UpdateCompanyDto} from './dto/update-company.dto';
import {Company, CompanyDocument} from "./schemas/company.schema";
import {SoftDeleteModel} from "soft-delete-plugin-mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {IUser} from "../users/user.interface";
import {User} from "../decorator/customize";

@Injectable()
export class CompaniesService {
    constructor(
        @InjectModel(Company.name)
        private CompanyModel: SoftDeleteModel<CompanyDocument>
    ) {
    }

    async create(createCompanyDto: CreateCompanyDto, user: IUser) {
        // const newCompany = await this.CompanyModel.create(
        //     {
        //       name:createCompanyDto.name,
        //       address:createCompanyDto.address,
        //       description:createCompanyDto.description
        //     }
        // )

        // return newCompany
        return this.CompanyModel.create({
            ...createCompanyDto,
            createdBy: {
                _id: user._id,
                email: user.email,
            }
        })
    }

    findAll() {
        return `This action returns all companies`;
    }

    findOne(id: number) {
        return `This action returns a #${id} company`;
    }

    async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
        return this.CompanyModel.updateOne(
            {_id: id},
            {
              ...updateCompanyDto,
              updatedBy: {
                _id: user._id,
                email: user.email,
              }
            },
        );
    }

    remove(id: number) {
        return `This action removes a #${id} company`;
    }
}
