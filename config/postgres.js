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

console.log('config', config)
// Use pgp to connect to postgres
// const db = pgp(config.connectionString);
const db = pgp('postgres://ywwlhtnxxuoftj:8ea08046d891c2639693669d8417cbf70c48d2e0c60789dcf091407949db133d@ec2-54-205-183-19.compute-1.amazonaws.com:5432/d2kear9ghj7ug3');

// Define the postgres configuration method
module.exports = function () {
  //return connection instance
  return db;
};





// // Load the module dependencies
// const config = require('./config');

// const Pool = require('pg').Pool;
// require('dotenv').config()

// /* http://bluebirdjs.com/docs/getting-started.html
//   replace ES6 promises
// */
// const promise = require('bluebird');

// // overrides pg-promise default promise library - ES6 Promises - with Bluebird, supuestamente es mejor que ES6 promises.
// const options = {
//   // Initialization Options
//   promiseLib: promise
// };

// //  overrode pg-promise’s default promise library - ES6 Promises - 
// // with Bluebird by setting the promiseLib property in the options object.
// const pgp = require('pg-promise')(options);

// // console.log('config', config)
// // Use pgp to connect to postgres
// let db;

// // if (process.env.NODE_ENV === 'production') {
// const profConfig = { connectionString: process.env.DATABASE_URL };
// const pool = new Pool(profConfig);
// db = pool;
// // }
// // else {
// //   db = pgp(config.connectionString);
// // }

// // Define the postgres configuration method
// module.exports = function () {
//   //return connection instance
//   return db;
// };