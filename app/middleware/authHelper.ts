import { compare, hash } from "bcryptjs";
import { createTransport } from "nodemailer";
import { AuthCheckInterface, MailSendInterface } from "../interface/authHelperInterface";
import {verify,JwtPayload} from 'jsonwebtoken'

export const hashPassword = async (password: string) => {
  try {
    const saltPassword = 10;
    const hashedPassword = await hash(password, saltPassword);
    

    return hashedPassword;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to hash password");
  }
};

export const comparePassword = async (
  password: string,
  hashedPassword: string 
) => {
  return compare(password, hashedPassword);
};

// email

export const createTransporter = (
  senderEmail: string | undefined,
  senderPassword: string | undefined
) => {
  const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: senderEmail,
      pass: senderPassword,
    },
  });
  return transporter;
};


export const mailSend: MailSendInterface = (transport, mailOptions) => {
  return new Promise((resolve, reject) => {
    transport.sendMail(mailOptions, (error) => {
      if (error) {
        reject({
          status: 500,
          message: "Technical Issue",
          error: error.message || error,  
        });
      } else {
        resolve({
          status: 200,
          message:
            "A verification email has been sent to your mail. Please click the link to verify, or else it will expire in 24 hours.",
        });
      }
    });
  });
}
//auth check


export const authCheck: AuthCheckInterface = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      status: 403,
      message: "A token is required",
    });
  }
  try {
    const decoded = verify(
      token,
      process.env.JWT_SECRET || "dkdjfkj"
    ) as JwtPayload;

    // req.user = decoded;
  } catch (error) {
    return res.status(401).send({
      status: false,
      message: "Invalid token",
    });
  }
  next();
};
