import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from '../decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  Subscriber,
  SubscriberDocument,
} from 'src/subscribers/schemas/Subscriber.schema';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import {Cron, CronExpression} from "@nestjs/schedule";

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private mailerService: MailerService,
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
  ) {}
  @Cron(CronExpression.EVERY_30_SECONDS)
  testCron(){
    console.log('call me')
  }
  @Get()
  @Public()
  @ResponseMessage('Test email')
  async handleTestEmail() {
    // const jobs = [
    //   {
    //     name: 'vue job',
    //     company: 'OG',
    //     salary: '5000',
    //     skills: ['REACT', 'NODEJS'],
    //   },
    //   {
    //     name: 'vue jo1b',
    //     company: 'OG1',
    //     salary: '5000',
    //     skills: ['REACT', 'NODEJS'],
    //   },
    // ];
    const subscribers = await this.subscriberModel.find({}); // lấy tất cả không check điều kieenj
    for (const subs of subscribers) {
      const subsSkills = subs.skills;
      const jobWithMatchingSkills = await this.jobModel.find({
        skills: { $in: subsSkills },
      });
      if (jobWithMatchingSkills?.length) {
        const jobs = jobWithMatchingSkills.map((item) => {
          return {
            name: item.name,
            company: item.company.name,
            salary:
              `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ',
            skills: item.skills,
          };
        });
        await this.mailerService.sendMail({
          to: 'babyghostcrabkiwikiwi@gmail.com',
          from: '"Support Team" <support@example.com>', // override default from
          subject: 'Welcome to Nice App! Confirm your Email',
          template: 'new-job',
          context: {
            receiver: subs.name,
            jobs: jobs,
          },
        });
      }
    }
  }
}
