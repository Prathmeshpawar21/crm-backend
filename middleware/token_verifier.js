const jwt = require("jsonwebtoken");

const tokenVerifier = (req, res, next) => {
  try {
    const token = req.headers["x-auth-token"];
    jwt.verify(token, process.env.SECRET_KEY);
    if (req.body.username !== jwt.decode(token).username) {
      throw new Error("Invalid username provided");
    }
    next();
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  tokenVerifier,
};
