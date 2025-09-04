const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username name must be provided"]
    },
    password: {
        type: String,
        required: [true, "password must be provided"]
    }
});

module.exports = mongoose.model("User", userSchema);
