import nodemailer from "nodemailer";

import { env } from "../../../config/env.js";
import {
  passwordResetEmailTemplate,
  verificationEmailTemplate,
} from "./email.templates.js";

class EmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: false,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(
    email: string,
    verificationUrl: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: env.EMAIL_FROM,
      to: email,
      subject: "Verify your FARRA email",
      html: verificationEmailTemplate(verificationUrl),
    });
  }

  async sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
    await this.transporter.sendMail({
      from: env.EMAIL_FROM,
      to: email,
      subject: "Reset your FARRA password",
      html: passwordResetEmailTemplate(resetUrl),
    });
  }

  async verifyConnection(): Promise<void> {
    await this.transporter.verify();
  }
}

export const emailService = new EmailService();
