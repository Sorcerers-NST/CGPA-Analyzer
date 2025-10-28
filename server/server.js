const express = require("express");
// const {prismaClient} = require('@prisma/client');
// const prisma = new prismaClient();
const connectDB = require("./db.js");
require("dotenv").config();
const app = express();

connectDB();

const PORT = 3000;
const serverURL = `https://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`Server Started, Listening at ${PORT}`);
  console.log(serverURL);
});
