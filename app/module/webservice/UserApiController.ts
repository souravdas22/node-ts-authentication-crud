import { Request, Response } from "express";
import { userRepository } from "../user/repo/user.repo";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import {
  comparePassword,
  createTransporter,
  hashPassword,
  mailSend,
} from "../../middleware/authHelper";
import UserModel from "../user/model/user.model";
import TokenModel from "../user/model/token.model";
import { randomBytes } from "crypto";
import { TokenInterface } from "../../interface/tokenmodelInterface";
import { UserInterface } from "../../interface/usermodelInterface";

class UserApiController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password, mobile } = req.body;
      const existingUser = await userRepository.findUser({ email });
      if (existingUser) {
        res.status(500).json({
          status: 500,
          message: "user already exists",
        });
      }
      const hashedPassword = await hashPassword(password);

      const user = new UserModel({
        name,
        email,
        password: hashedPassword,
        mobile,
      });
      if (req.file) {
        user.image = req.file.path;
      }
      await userRepository.save(user);
      const token_model = new TokenModel({
        _userId: user._id,
        token: randomBytes(16).toString("hex"),
      });
      await token_model.save();
      const senderEmail = process.env.MAIL_ID;
      const senderPassword = process.env.PASSWORD;
      const transport = createTransporter(senderEmail, senderPassword);

      const mailOptions = {
        from: senderEmail,
        to: user.email,
        subject: "Email Verification ",
        text: "Hello " + user.name,
        html: `
        <p>Please verify your account by clicking the link:</p>
        <a href="${process.env.LOCAL_PORT_URL}/confirmation/${user.email}/${token_model.token}">
         Verify Email
        </a>
        <p>Thank you!</p>
         `,
      };
      const response = await mailSend(transport, mailOptions);
      console.log(response.message);

      res.status(200).json({
        status: 200,
        message: `Verification link sent successfully to ${user.email}`,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Error in registration",
        error: error,
      });
    }
  }
  async confirmation(req: Request, res: Response) {
    try {
      const token: TokenInterface | null = await userRepository.findToken({
        token: req.params.token,
      });
      if (!token) {
        const { email } = req.params;
        const user: UserInterface | null = await userRepository.findUser({
          email,
        });
        const token_model = new TokenModel({
          _userId: user?._id,
          token: randomBytes(16).toString("hex"),
        });
        await token_model.save();

        const senderEmail = process.env.MAIL_ID;
        const senderPassword = process.env.PASSWORD;
        const transport = createTransporter(senderEmail, senderPassword);
        const mailOptions = {
          from: senderEmail,
          to: email,
          subject: "Email Verification",
          html: `
        <p>This is a new link for for verifying your email which will expire in 10 mins \n\n click the link below to verify:</p>
        <a href="${process.env.LOCAL_PORT_URL}/confirmation/${email}/${token_model.token}">
        Verify Email
        </a>
        <p>Thank you!</p>
         `,
        };
        const response = await mailSend(transport, mailOptions);
        console.log(response.message);

        res.status(400).json({
          status: 400,
          message: `verification link may be expired,New verification link sent to ${email}`,
        });
      } else {
        const user: UserInterface | null = await userRepository.findUser({
          _id: token._userId,
        });
        if (!user) {
          res.status(404).send({
            status: 404,
            message: "User not found",
          });
        }
        if (user?.isVerified) {
          res.status(400).send({
            status: 400,
            message: "User already verified",
          });
        }
        if (user) {
          user.isVerified = true;
          await user.save();
        }

        res.status(200).send({
          status: 200,
          message:
            "User verified successfully. Now you can login to your account.",
        });
      }
    } catch (error) {
      res.status(500).send({
        status: 500,
        message: "Error in email verification",
        error: error,
      });
    }
  }
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      //check user
      const user: UserInterface | null = await userRepository.findUser({
        email,
      });

      if (!user) {
        res.status(404).json({
          status: 404,
          message: "Email is not registered",
        });
      }
      if (user?.isVerified === false) {
        res.status(401).json({
          status: 401,
          message: "User not verified",
        });
      }
      if (user) {
        const match = await comparePassword(password, user?.password);
        if (!match) {
          res.status(401).json({
            status: 401,
            message: "Invalid password",
          });
        }
      }

      const token = sign(
        {
          id: user?._id,
          name: user?.name,
          email: user?.email,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "12h" }
      );
      res.status(200).json({
        status: 200,
        message: "Login successfull",
        user: {
          id: user?._id,
          name: user?.name,
          email: user?.email,
          image: user?.image,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Login Unsucessfull",
        error: error,
      });
    }
  }
  // update password
  async updatePassword(req: Request, res: Response) {
    try {
      const token = req.params.token || req.headers["x-access-token"];
      if (!token) {
        res.status(403).send({
          status: "403",
          message: "a token is required ",
        });
      }
      const decoded: JwtPayload = verify(
        token as string,
        process.env.JWT_SECRET as string
      ) as JwtPayload;
      const email = decoded?.email;
      const user: UserInterface | null = await userRepository.findUser({
        email,
      });
      if (!user) {
        res.status(404).json({
          status: 404,
          message: "User not found",
        });
      }

      const  newPassword  = req.body.newPassword;
      if (!newPassword) {
        res.status(400).json({
          status: 400,
          message: "New password is required",
        });
      }
      const hashpass = await hashPassword(newPassword);
      if (user) {
        await userRepository.edit(user?._id, { password: hashpass });
      }
      res.status(200).send({
        status: 200,
        message: " password updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Error in password reset",
      });
    }
  }
  //reset password
  async forgetPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      //check user
      const user: UserInterface | null = await userRepository.findUser({
        email,
      });

      if (!user) {
        res.status(404).send({
          status: 404,
          message: "Email is not registered",
        });
      }
      if (user?.isVerified === false) {
        res.status(500).send({
          status: 500,
          message: "email is not verified",
        });
      }
      const token_model = new TokenModel({
        _userId: user?._id,
        token: randomBytes(16).toString("hex"),
      });
      await token_model.save();

      const senderEmail = process.env.MAIL_ID;
      const senderPassword = process.env.PASSWORD;
      const transport = createTransporter(senderEmail, senderPassword);
      const mailOptions = {
        from: senderEmail,
        to: user?.email,
        subject: "Forgot Password",
        html: `
        <p>create a new password by clicking the link below:</p>
         <a href="${process.env.LOCAL_PORT_URL}/password-reset/${user?.email}/${token_model.token}">
        Reset Password
        </a>
        <p>Thank you!</p>
         `,
      };
      if (user?.isVerified) {
        const response = await mailSend(transport, mailOptions);
        console.log(response.message);
      }

      res.status(200).send({
        status: 200,
        message: "password reset link sent successfully on your email",
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        message: "Error in password reset",
        error: error,
      });
    }
  }
  // reset email confirmation
  async passwordresetconfirmation(req: Request, res: Response) {
    try {
      const token = await userRepository.findToken({ token: req.params.token });

      if (!token) {
        const { email } = req.params;
        const user = await userRepository.findUser({ email });
        const token_model = new TokenModel({
          _userId: user?._id,
          token: randomBytes(16).toString("hex"),
        });
        await token_model.save();

        const senderEmail = process.env.MAIL_ID;
        const senderPassword = process.env.PASSWORD;
        const transport = createTransporter(senderEmail, senderPassword);
        const mailOptions = {
          from: senderEmail,
          to: email,
          subject: "Forgot Password",
          html: `
        <p>This is a new link for creating a new password which will expire in 10 mins \n\n click the link below to create a new password:</p>
        <a href="${process.env.LOCAL_PORT_URL}/password-reset/confirmation/${email}/${token_model.token}">
        Reset Password
        </a>
        <p>Thank you!</p>
         `,
        };
        mailSend(transport, mailOptions);

        res.status(400).json({
          status: 400,
          message: `reset link may be expired,New reset link sent to ${email}`,
        });
      } else {
        const user = await userRepository.findUser({
          _id: token._userId,
          email: req.params.email,
        });
        if (!user) {
          res.status(404).json({
            status: 404,
            message: "User not found",
          });
        }
        if (user?.isVerified) {
          res.status(200).json({
            status: 200,
            message: "User verified now you can reset password",
            id: user._id,
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Error in email verification",
      });
    }
  }
  // new reset password
  async newPasswordReset(req:Request, res:Response) {
    try {
      const email = req.params.email;
      const user = await userRepository.findUser({ email });
      const userId = user?._id;
      const token = await userRepository.findToken({ _userId: userId });
      if (token) {
        await userRepository.deleteToken({ _id: token._id }); 
      }
      const newPassword = req.body.newPassword;
      const hashedPassword = await hashPassword(newPassword);
      await userRepository.resetPassword(
        { email },
        { password: hashedPassword }
      );
      res.status(200).json({
        status: 200,
        message: " password reset successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Error in password reset",
      });
    }
  }
}
export const userApiController = new UserApiController();
