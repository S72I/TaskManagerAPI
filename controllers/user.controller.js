const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Users = require("../models/user.model");

const register = asyncHandler(async (req, res) => {
  console.log(req.body);

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    res.json({ err: "All fields are mandatory" });
  }

  const userAvail = await Users.findOne({ email });
  if (userAvail) {
   return res.status(400).json({ err: "Email already Exist use another email" });
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const user = await Users.create({ name, email, password: hashPassword });
  if (user) {
    const accessToken = jwt.sign(
      {
        user: {
          name: user.name,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "24h" }
    );
    res.status(200).json(accessToken);
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    res.status(400).json({ err: "All fields are mandatory" });
  }

  try {
    const user = await Users.findOne({ email });
    if (email && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        {
          user: {
            name: user.name,
            id: user.id,
          },
        },
        process.env.ACCESS_TOKEN_SECERT,
        { expiresIn: "24h" }
      );

      res.status(200).json(accessToken);
    } else {
      res.status(401).json({ err: "Email or Password invalid try again" });
    }
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
});

module.exports = { register, login };
