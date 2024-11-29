import express from 'express'; 
import dotenv from 'dotenv';
import { dbConnection } from './app/config/db';
import bodyParser from 'body-parser';

dotenv.config();
dbConnection();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/uploads", express.static("uploads"));

import { productRouter } from "./router/api/product.api.routes";
import { userRouter } from './router/api/user.api.routes';

app.use("/api", productRouter);
app.use("/api", userRouter);

const PORT = process.env.PORT || 7001;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
})
