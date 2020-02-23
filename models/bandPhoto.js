module.exports = function(sequelize, DataTypes) {

    var BandPhoto = sequelize.define('BandPhoto',{
        filename: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    });

    BandPhoto.associate = models => {
        BandPhoto.belongsTo(models.User);
      };
    
    return BandPhoto;
}