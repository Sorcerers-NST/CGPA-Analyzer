const express = require("express");
const connectDB = require("../db.js");
require("dotenv").config();
const app = express();

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Started, Listening at ${PORT}`);
});
