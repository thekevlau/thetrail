module.exports = function(sequelize, DataTypes) {
  var Tag = sequelize.define('Tag', {
	id: {
		type: DataTypes.UUID,
    autoIncrement: true,
		primaryKey: true
	},
	name: DataTypes.STRING
  }, {
  	tableName: 'Tag',
    classMethods: {
      associate: function(models) {
      	Tag.hasMany(models.Trail, {through: 'TaggedBy'});
      }
    }
  });

  return Tag;
};