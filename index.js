import express from 'express';
import database from './config/dbconnect.js';
import authRouter from './routes/authRoutes.js';
import { notFound , notfoundHandler } from './middlewars/errorHandler.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import productRouter from './routes/productRoutes.js';
import morgan from 'morgan';
import slugify from 'slugify';
import blogRouter from './routes/blogRoutes.js';
import ProdCategoryRouter from './routes/prodCategoryRouts.js';
import BlogCategoryRouter from './routes/blogCategoryRoutes.js';
import BrandRouter from './routes/brandRoutes.js';
import couponRouter from './routes/couponRoutes.js';
import cors from 'cors';
// import requestLogger from './middlewares/requestLogger.js';
// import api from './api/index.js';
// import CONFIG from './config.json' assert {type: 'json'}
// import cors from 'cors';
// import swagger from './api/swagger.js';
const app = express();
dotenv.config();
database();
const PORT = process.env.PORT || 8001;
app.use(morgan('dev'));
app.use(cors({
    origin: 'http://localhost:3000', // Adjust this based on where your React app is running
    credentials: true,
  }));
// remember in this case i have used this to get more information about the passed requests.
app.use(express.json());
app.use(cookieParser());

// console.log('Cloud Name:', process.env.a);
app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/prodcategory", ProdCategoryRouter);
app.use("/api/blogcategory" , BlogCategoryRouter);
app.use("/api/brand" , BrandRouter);
app.use("/api/coupon" , couponRouter);

app.use(notFound);
app.use(notfoundHandler);
// remember here in this case we have used the notFound middleware this one is used to create an error in case if the route i mean the endpoint we are trying to access is not define.
// remember after we have used the middleware the handler we need to handle both the errors we have created and the other errors.
// remember here in this case if the route matches no one of those handlers are gonna be executed so if one goes to the second handler this mean that ther is an error so the status must be not 200 that s why we have changed it.
// remember in this case if an error has been made in the endpoint then it will be passed to the notfoundhandler since it is the first middlewar that takes as parameter ERROR.
app.listen( PORT , () => {
    console.log( `the server is running in the port ${PORT} `);
});