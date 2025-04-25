const mongoose = require("mongoose");

const Users = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the name"],
  },
  email: {
    type: String,
    required: [true, "Please enter the email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter the password"],
  },
});

module.exports = mongoose.model("Users", Users);
