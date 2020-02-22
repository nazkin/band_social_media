

module.exports = function(sequelize, DataTypes) {
    
    var Bands = sequelize.define('Bands', {
            bandname: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: false
            },
            avatar: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: false
            }, 
            members: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: false
            },        
            songs:{
                type: DataTypes.STRING,
                allowNull: false,
                unique: false
            },
            neededTalents: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: false
            }, 
            location: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: false
            }
            
    });
    Bands.associate = models => {
        Bands.belongsTo(models.User);
      };

    return Bands;
}