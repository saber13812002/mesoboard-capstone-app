// Load the module dependencies
const config = require('./config');

/* http://bluebirdjs.com/docs/getting-started.html
  this replaces ES6 promises, it's supposed to be better.
*/
const promise = require('bluebird');

// overrides pg-promise default promise library - ES6 Promises - with Bluebird, supuestamente es mejor que ES6 promises.
const options = {
  // Initialization Options
  promiseLib: promise
};

//  overrode pg-promise’s default promise library - ES6 Promises - 
// with Bluebird by setting the promiseLib property in the options object.
const pgp = require('pg-promise')(options);
// Use pgp to connect to postgres
const db = pgp(config.db);
// Define the postgres configuration method
module.exports = function () {
  //return connection instance
  return db;
};