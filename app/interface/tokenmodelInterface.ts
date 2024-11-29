import mongoose from "mongoose"
export interface TokenInterface {
  _userId ?: mongoose.Types.ObjectId;
  token ?: string;
  expiredAt ?: Date;
}