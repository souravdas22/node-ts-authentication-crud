import { Router } from "express";
import { userImage } from "../../app/helper/userImage";
import { userApiController } from "../../app/module/webservice/UserApiController";

export const userRouter = Router();

userRouter.post(
  "/register",
  userImage.single("image"),
  userApiController.register
);
userRouter.get("/confirmation/:email/:token", userApiController.confirmation);
userRouter.post("/login", userApiController.login);

// update password
userRouter.post(
  "/update-password",
  userApiController.updatePassword
);
// forget password
userRouter.post("/forget-password", userApiController.forgetPassword);
// password reset confirmation
userRouter.get(
  "/password-reset/confirmation/:email/:token",
  userApiController.passwordresetconfirmation
);
//new password
userRouter.post("/new-password/:email", userApiController.newPasswordReset);