var bcrypt = require("bcryptjs");

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    // The password cannot be null
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  //Naz: This creates a one-to-many relationship with the messages table
  //************************************************************************************************
  User.associate = models => {
    User.hasMany(models.UserMessages);
  };
  //************************************************************************************************
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

 User.beforeCreate(user => {
   user.password = bcrypt.hashSync(
     user.password,
      bcrypt.genSaltSync(10),
      null
    );
  });


  return User;
};


//NAZARS DATABASE USERS
// severus, albus, harry, ron, voldemort --@hogwarts.com