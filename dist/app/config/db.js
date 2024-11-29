"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const userName = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const dbName = process.env.DB_DATABASE;
const dbHost = process.env.DB_HOST;
const ConnectionString = `mongodb+srv://${userName}:${password}@${dbHost}/${dbName}`;
const dbConnection = async () => {
    try {
        await mongoose_1.default.connect(ConnectionString).then((res) => {
            if (res) {
                console.log("Database connection successfull !!");
            }
        });
    }
    catch (err) {
        console.log("Error in db connection ", err);
    }
};
exports.dbConnection = dbConnection;
