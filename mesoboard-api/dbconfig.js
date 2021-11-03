// var Connection = require('tedious').Connection;
// // const config = {
// //   server: 'localhost',
// //   user: 'sa',
// //   password: 'Mesoboard!123456',

// //   port: 57987,
// //   database: 'Mesoboard',
// //   // database: 'MesoboardFirst',
// //   // database: 'MesoboardSecond',
// //   options: {
// //     instanceName: 'SQLEXPRESS01'
// //   }
// // }
// var config = {
//   server: 'localhost',
//   authentication: {
//     type: 'default',
//     options: {
//       userName: 'sa',
//       password: 'Mesoboard!123456'
//     }
//   },
//   options: {
//     // If you are on Microsoft Azure, you need encryption:
//     // encrypt: false,
//     database: 'Mesoboard'  //update me
//   }
// };
// var connection = new Connection(config);
// connection.on('connect', function (err) {
//   // If no error, then good to proceed.  
//   console.log("Connected");
//   executeStatement1();
// });

// connection.connect();

// var Request = require('tedious').Request
// var TYPES = require('tedious').TYPES;

// function executeStatement1() {
//   request = new Request("Select * from Users;", function (err) {
//     if (err) {
//       console.log(err);
//     }
//   });
//   // request.addParameter('Name', TYPES.NVarChar, 'SQL Server Express 2014');
//   // request.addParameter('Number', TYPES.NVarChar, 'SQLEXPRESS2014');
//   // request.addParameter('Cost', TYPES.Int, 11);
//   // request.addParameter('Price', TYPES.Int, 11);
//   console.log('request', request)
//   request.on('row', function (columns) {
//     console.log('columns', columns)
//     columns.forEach(function (column) {
//       if (column.value === null) {
//         console.log('NULL');
//       } else {
//         console.log("Product id of inserted item is " + column.value);
//       }
//     });
//   });

//   // Close the connection after the final event emitted by the request, after the callback passes
//   request.on("requestCompleted", function (rowCount, more) {
//     connection.close();
//   });
//   connection.execSql(request);
// }







// const config = {
//   db: 'postgres://iapadmin:iap_2021@iap.ece.uprm.edu:5432/iap',
//   port: 3001,
// };


// const sql = require('mssql')


const config = {
  user: 'admin',
  host: 'localhost',
  database: 'mesodb',
  password: 'meso_2021',
  port: 5432,
};

