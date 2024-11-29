"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./app/config/db");
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
(0, db_1.dbConnection)();
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
const PORT = process.env.PORT || 7001;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
