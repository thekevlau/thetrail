module.exports = function(sequelize, DataTypes) {
  var Trail = sequelize.define('Trail', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    date_created: DataTypes.DATE,
    forked_from: DataTypes.STRING,
    num_views: DataTypes.INTEGER
  }, {
    tableName: 'Trail',
    classMethods: {
      associate: function(models) {
        Trail.belongsTo(models.User);
        Trail.belongsToMany(models.Resource, {through: 'Step'});
        Trail.belongsToMany(models.User, {through: 'TaggedBy'});
      }
    }
  });

  return Trail;
};