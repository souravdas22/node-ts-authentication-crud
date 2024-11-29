import { registerInterface } from "../../../interface/userControllerInterface";
import TokenModel from "../model/token.model";
import UserModel from "../model/user.model";
import mongoose, { Document } from "mongoose";

class UserRepository {

  async save(data: registerInterface): Promise<Document | null> {
    try {
      const newUser = await UserModel.create(data);
      return newUser; 
    } catch (error) {
      console.error(error);
      return null; 
    }
  }
  async findUser(query: object) {
    try {
      const user = await UserModel.findOne(query);
      return user; 
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async edit(productId: mongoose.Types.ObjectId | undefined, password: object) {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        productId,
         password , 
        { new: true } 
      );
      return updatedUser; 
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  
  async findToken(query: object){
    try {
      const token = await TokenModel.findOne(query);
      return token; 
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async resetPassword(
    email: object,
    password: object,
  ) {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
       email, 
         password , 
        { new: true } 
      );
      return updatedUser;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteToken(id:object ) {
    try {
      const deletedToken = await TokenModel.deleteOne({ _id: id });
      return deletedToken; 
    } catch (error) {
      console.error(error);
      return { deletedCount: 0 }; 
    }
  }
}

export const userRepository =  new UserRepository();
