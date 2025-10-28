const mongoose = require("mongoose");
const {Schema} = mongoose;

const userSchema = new mongoose.schema({
    email: {
        type: string,
        required: true
    },
    password: {
        type: string,
        required: true
    }
})

module.exports = mongoose.model("User", userSchema, "users")