import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import allRoutes from "./routes/index.js";
import passport from 'passport'
import setupGooglePassport from './config/passportGoogle.js'
import { errorHandler } from './middlewares/error.middleware.js'

const app = express();

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: process.env.CLIENT_URL || true,
  credentials: true,
}
app.use(cors(corsOptions));

setupGooglePassport()
app.use(passport.initialize())

app.use(allRoutes);

// Global error handler - MUST be after all routes
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Started, Listening at ${PORT}`);
});
