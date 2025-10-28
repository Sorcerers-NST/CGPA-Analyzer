const mongoose = require("mongoose");
require("dotenv").config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.CLUSTER_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected Successfully to the Cluster");
  } catch (err) {
    console.error(" Error connecting please verify ", err);
  }
}

module.exports = connectDB;
