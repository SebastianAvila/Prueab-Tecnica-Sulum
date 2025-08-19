// models/user.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // asegúrate que apunta a tu DB

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // no puede haber usuarios repetidos
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
