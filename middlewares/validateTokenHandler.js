const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validWebToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, (err, decode) => {
      if (err) {
        res.status(401);
        res.json({ err: "user is not Authorized" });
      }
      req.user = decode.user;
      next();
    });
    if (!token) {
      res.status(400);
      res.json({ err: "Token is invalid try again" });
    }
  }
});

module.exports = validWebToken;
