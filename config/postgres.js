// Load the module dependencies
const config = require('./config');

/* http://bluebirdjs.com/docs/getting-started.html
  replace ES6 promises
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

// console.log('config', config)
// Use pgp to connect to postgres
const db = pgp(config.connectionString);

// Define the postgres configuration method
module.exports = function () {
  //return connection instance
  return db;
};