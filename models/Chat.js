const Sequelize = require("sequelize");

const sequelize = require("../util/database");

console.log("trigger2");
const Chat = sequelize.define("meassage", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  message: Sequelize.STRING,

 
});

module.exports = Chat;
