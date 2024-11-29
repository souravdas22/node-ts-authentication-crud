import { Schema, model } from "mongoose";
import { TokenInterface } from "../../../interface/tokenmodelInterface";

const tokenSchema = new Schema<TokenInterface>({
  _userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  expiredAt: {
    type: Date,
    default: () => Date.now() + 60 * 1000,
    index: { expires: "1m" },
  },
});
const TokenModel = model("Token", tokenSchema);
export default TokenModel;
