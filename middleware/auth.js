const Sequelize = require("sequelize");

const jwt = require("jsonwebtoken");
const Auth = require("../models/Auth");

const authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log(token);
    const user = jwt.verify(token, "secret");

    Auth.findByPk(user.userId).then((user) => {
      req.user = user; //user
      next();
    });
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .json({ success: "not authenticated to sharpener website" });
    //err
  }
};

module.exports = {
  authenticate,
};
