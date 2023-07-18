import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Job, JobSchema} from "./schemas/job.schema";

@Module({
  // keets nối đêến db job mongoose
  imports:[MongooseModule.forFeature([{name:Job.name,schema:JobSchema}])],
  controllers: [JobsController],
  providers: [JobsService]
})
export class JobsModule {}
