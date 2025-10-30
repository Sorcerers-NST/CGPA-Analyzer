import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import allRoutes from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

// CORS - allow client origin in development. Set CLIENT_URL in env for production.
const corsOptions = {
  origin: process.env.CLIENT_URL || true,
  credentials: true,
}
app.use(cors(corsOptions));

app.use(allRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Started, Listening at ${PORT}`);
});
