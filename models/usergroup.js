const Sequelize = require("sequelize");

const sequelize = require("../util/database");
const Usergroup = sequelize.define("usergroup", {
  userid: {
    type: Sequelize.INTEGER,
  },
  groupid: {
    type: Sequelize.INTEGER,
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});
module.exports = Usergroup;
