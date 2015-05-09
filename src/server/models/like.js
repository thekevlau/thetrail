module.exports = function(sequelize, DataTypes) {
  var Like = sequelize.define('Like', {
    deleted: DataTypes.DATE,
    date: DataTypes.DATE
  }, {
    tableName: 'Like'
  });

  return Like;
};