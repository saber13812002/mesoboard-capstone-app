const http = require('http');
const methodOverride = require('method-override'); //https://www.npmjs.com/package/method-override
const express = require('express');
const path = require('path');
const cors = require('cors');
// const morgan = require('morgan'); // https://www.npmjs.com/package/morgan
// const winston = require('winston');
// const { createLogger, format } = winston;
// const { combine, timestamp, label, printf, prettyPrint, json } = format;

module.exports = function () {
  const app = express();
  const server = http.createServer(app);

  app.use(methodOverride());
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cors());

  // const allowedOrigins = ['http://localhost:3000', 'https://mesoboard-capstone-app.herokuapp.com', 'http://mesoboard-capstone-app.herokuapp.com', 'http://mesoboard-capstone-app.herokuapp.com/3001'];
  // const corsOptions = {
  //   origin: function (origin, callback) {
  //     // allow requests with no origin 
  //     // (like mobile apps or curl requests)
  //     if (!origin) return callback(null, true);
  //     if (allowedOrigins.indexOf(origin) === -1) {
  //       const msg = 'The CORS policy for this site does not ' +
  //         'allow access from the specified Origin.';
  //       return callback(new Error(msg), false);
  //     }
  //     return callback(null, true);
  //   },
  //   methods: 'POST, GET, OPTIONS, PUT, DELETE',
  //   allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, token, api_key'
  // };
  // app.use(cors(corsOptions));
  ////// app.use(fileUpload());

  /***************************/
  /* REQUIRE THE ROUTES HERE */
  /***************************/
  require('../routes/authentication-routes')(app);
  require('../routes/permissions-routes')(app);
  // require('../routes/users-routes')(app);

  // Have Node serve the files for our built React app
  app.use(express.static(path.resolve(__dirname, '../app-react/build')));

  // All other GET requests not handled before will return our React app
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../app-react/build', 'index.html'));
  });

  return server;
}
