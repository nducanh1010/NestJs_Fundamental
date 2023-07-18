import {Injectable} from '@nestjs/common';
import {CreateJobDto} from './dto/create-job.dto';
import {UpdateJobDto} from './dto/update-job.dto';
import {IUser} from "../users/user.interface";

@Injectable()
export class JobsService {
    async create(createJobDto: CreateJobDto, user: IUser) {
        const {
            name,
            skills,
            salary,
            location,
            endDate,
            startDate,
            isActive,
            level,
            quantity,
            description,
            company
        } = createJobDto
        return 'This action adds a new job';
    }

    findAll() {
        return `This action returns all jobs`;
    }

    findOne(id: number) {
        return `This action returns a #${id} job`;
    }

    update(id: number, updateJobDto: UpdateJobDto) {
        return `This action updates a #${id} job`;
    }

    remove(id: number) {
        return `This action removes a #${id} job`;
    }
}
