const Sequelize = require("sequelize");

const sequelize = require("../util/database");

console.log("triggerdd2");
const Group = sequelize.define("group", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  GroupName: Sequelize.STRING,

 
});

module.exports = Group;