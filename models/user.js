'use strict';
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    googleId: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  User.beforeCreate((user, options) => {
    //console.log(user)
   var  hash = bcrypt.hashSync(user.password, 10);
    
      console.log(hash)
     return user.password = hash
    
  });

  User.beforeUpdate((user, options) => {
    //console.log(user)
   var  hash = bcrypt.hashSync(user.password, 10);
    
      console.log(hash)
     return user.password = hash
    
  });

  User.authenticate = async function(email, password) {
    console.log(email)
    const user = await User.findOne({ where: { email } });

    // bcrypt is a one-way hashing algorithm that allows us to 
    // store strings on the database rather than the raw
    // passwords. Check out the docs for more detail
    if (bcrypt.compareSync(password, user.password)) {
      return user;
    }

    throw new Error('invalid password');
  }
  return User;
};