'use strict';

var fs        = require('fs');
var path      = require('path');
var pg        = require('pg');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);

var dbName = 'trail'; 
var conStringPri = 'postgres://localhost:5432/' + dbName;

/*
var client = new pg.Client(conStringPri);
client.query('CREATE DATABASE ' + dbName, function(err) { // create user's db
  if (err) 
    console.log('ignoring the error'); // ignore if the db is there
  client.end(); // close the connection

});
*/

var sequelize = new Sequelize(conStringPri);
var db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;