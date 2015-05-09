module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING(30),
      autoIncrement: true,
      primaryKey: true
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    url: DataTypes.STRING,
    description: DataTypes.TEXT,
    date_created: DataTypes.DATE,
    last_login: DataTypes.DATE,
    dob: DataTypes.DATE,
    education_level: DataTypes.STRING,
    field: DataTypes.STRING,
    gender: DataTypes.ENUM('M', 'F')
  }, {
    tableName: 'User',
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Trail, {through: 'Own'});
        User.hasMany(models.Trail, {through: 'Like'});
      }
    }
  });

  return User;
};