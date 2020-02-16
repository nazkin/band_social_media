//Naz: This is the message table that will have a one to many relationship with the User table
//Meaning that a User can have many messages attributed to them.

module.exports = (sequelize, DataTypes)=> {
    var UserMessages = sequelize.define('UserMessages', {
        sentBy: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        }
    });

    return UserMessages;
}