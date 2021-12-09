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

let PROD_DATABASE_URL;
if (process.env.NODE_ENV === 'production')
  PROD_DATABASE_URL = `postgres://yxdxovsklgoakk:189290976e2eb41d4c3377ce0f8743ab4e826007eb5526af496eec159e173637@
  ec2-18-210-159-154.compute-1.amazonaws.com:5432/d7utqaaqfbc7n0`;

// Use pgp to connect to postgres
const db = pgp(PROD_DATABASE_URL || config.connectionString);
// Define the postgres configuration method
module.exports = function () {
  //return connection instance
  return db;
};


console.log(`postgresql://${config.user}:${config.password}@${config.host}:${config.post}/${config.database}`)



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