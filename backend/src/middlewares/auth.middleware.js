const jwt = require("jsonwebtoken");

const config = require("../config/config");
const jwtService = require("../modules/auth/jwt.service");
const UnauthorizedError = require("../errors/UnauthorizedError");

function authJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Token not found");
  }

  // split bearer token
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwtService.verify(token);

    req.user = decoded;
    req.userId = decoded.id;
    next();
  } catch (err) {
    throw new UnauthorizedError("Token is expired / not valid");
  }
}

module.exports = authJWT;
