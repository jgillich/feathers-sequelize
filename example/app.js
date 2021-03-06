var feathers = require('feathers');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');
var path = require('path');
var sequelizeService = require('../lib');
var sequelize = new Sequelize('sequelize', '', '', {
  dialect: 'sqlite',
  storage: path.join(__dirname, 'db.sqlite'),
  logging: false
});
var Todo = sequelize.define('todo', {
  text: {
    type: Sequelize.STRING
  },
  complete: {
    type: Sequelize.BOOLEAN
  }
}, {
  freezeTableName: true
});

// Removes all database content
Todo.sync({ force: true });

// Create a feathers instance.
var app = feathers()
  // Enable Socket.io
  .configure(feathers.socketio())
  // Enable REST services
  .configure(feathers.rest())
  // Turn on JSON parser for REST services
  .use(bodyParser.json())
  // Turn on URL-encoded parser for REST services
  .use(bodyParser.urlencoded({ extended: true }));

// Create an in-memory Feathers service with a default page size of 2 items
// and a maximum size of 4
app.use('/todos', sequelizeService({
  Model: Todo,
  paginate: {
    default: 2,
    max: 4
  }
}));

// Start the server
module.exports = app.listen(3030);

console.log('Feathers Todo memory service running on 127.0.0.1:3030');
