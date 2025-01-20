import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { config } from 'dotenv';
config();

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    const mailOptions = {
      from: 'Library-System test@mail.com',
      to,
      subject,
      text,
      html,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
