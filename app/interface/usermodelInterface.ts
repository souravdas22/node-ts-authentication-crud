import mongoose from "mongoose";

export interface UserInterface {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  mobile: string;
  image?: string;
  isVerified?: boolean;
  save(): unknown;
}