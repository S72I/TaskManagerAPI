const express = require("express");
const { register, login } = require("../controllers/user.controller");
const userRoutes = express.Router();

userRoutes.post("/register", register);
userRoutes.post("/login", login);

module.exports = { userRoutes };
