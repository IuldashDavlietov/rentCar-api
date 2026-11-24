// sendMail(to, subject, message)

import nodemailer from "nodemailer";
import { env } from "../configs/env";

export default function sendMail(to: string, subject: string, message: string): void {
  //* GoogleMail (gmail)
  //* Google -> AccountHome -> Security -> Two-Step-Verify -> App-Passwords
  //* Never write the password in the code, keep it in .env
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.MAIL_USER,
      pass: env.MAIL_PASS,
    },
  });

  // SendMail:
  transporter.sendMail(
    {
      from: env.MAIL_USER,
      // to: 'abc@def.com, def@ghi.com'
      to: to,
      // subject: 'Hello',
      subject: subject,
      // text: 'Hello There. How are you?',
      text: message,
      // html: '<p> <b> Hello There </b> <br> How are you? </p>',
      html: message,
    },
    (error, success) => {
      success ? console.log("SUCCESS:", success) : console.log("ERROR: ", error);
    },
  );
}
