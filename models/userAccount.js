

module.exports = function(sequelize, DataTypes) {
    
    var UserAccount = sequelize.define('UserAccount', {
            nickname: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: false
            },
            avatar: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: false
            }, 
            description: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: false
            },        
            city:{
                type: DataTypes.STRING,
                allowNull: false,
                unique: false
            },
            province: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: false
            }, 
            zip: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: false
            }
            
    });
    UserAccount.associate = models => {
        UserAccount.belongsTo(models.User);
      };

    return UserAccount;
}