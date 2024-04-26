import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import nodemailerConfig from './config';
import { EmailConfirmationToken } from '../utils';


@Injectable()
export class MailService {
  private readonly transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport(nodemailerConfig);
  }

  async sendConfirmationEmail(email: string, confirmationCode: EmailConfirmationToken): Promise<void> {
    try {
      const baseUrl = this.configService.get<number>('BASE_URL');
      const emailFrom = this.configService.get<number>('EMAIL_FROM');
      
      const mailOptions = {
        from: emailFrom,
        to: email,
        subject: 'Confirm Your Email',
        text: `Click the following link to confirm your email: ${baseUrl}/confirm/${confirmationCode}`,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      this.logger.error(
        `Error sending email to provided address ${email}`,
        error?.message,
        'Stack Trace: ',
        error?.stack,
    );
      throw error
    }
  }
}