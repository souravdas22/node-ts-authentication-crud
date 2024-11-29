import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const userName = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const dbName = process.env.DB_DATABASE;
const dbHost = process.env.DB_HOST;

const ConnectionString = `mongodb+srv://${userName}:${password}@${dbHost}/${dbName}`;

export const dbConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(ConnectionString).then((res) => {
      if (res) {
        console.log("Database connection successfull !!");
      }
    });
  } catch (err) {
    console.log("Error in db connection ", err);
  }
};
