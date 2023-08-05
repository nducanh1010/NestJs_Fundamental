import {Controller, Get} from '@nestjs/common';
import { MailService } from './mail.service';
import {Public, ResponseMessage} from "../decorator/customize";
import {MailerService} from "@nestjs-modules/mailer";

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService,
  private  mailerService:MailerService
) {}
  @Get()
  @Public()
  @ResponseMessage("Test email")
  async handleTestEmail() {
    await this.mailerService.sendMail({
      to: "babyghostcrabkiwikiwi@gmail.com",
      from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      html: '<b>welcome bla bla duc anh nest js</b>', // HTML body content
    });
  }

}
