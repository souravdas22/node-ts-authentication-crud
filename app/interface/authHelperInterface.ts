import { NextFunction, Request, Response } from "express";
import { Transporter, SendMailOptions } from "nodemailer";


interface MailSendSuccessResponse {
  status: number;
  message: string;
}
interface MailSendErrorResponse {
  status: number;
  message: string;
  error: string | Error;
}
export interface MailSendInterface {
  (transport: Transporter, mailOptions: SendMailOptions): Promise<
    MailSendSuccessResponse | MailSendErrorResponse
  >;
}
export interface AuthCheckInterface {
  (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void;
}

