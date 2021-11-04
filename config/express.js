const http = require('http');
const morgan = require('morgan'); // https://www.npmjs.com/package/morgan
const methodOverride = require('method-override'); //https://www.npmjs.com/package/method-override
const winston = require('winston');
const { createLogger, format } = winston;
const { combine, timestamp, label, printf, prettyPrint, json } = format;
const express = require('express');
const path = require('path');
const cors = require('cors');

module.exports = function () {

  const app = express();
  const server = http.createServer(app);


  // format for logs
  const customFormat = combine(
    prettyPrint(),
    timestamp(),
    json(),
    printf(info => {
      let label = 'Not specified';
      let message = 'Error';
      let file = 'Not specified';
      let fun = 'Not specified';

      if (info.label instanceof String) {
        label = info.label;
      }
      if (info.message instanceof String) {
        message = info.message;
      }
      if (info.file instanceof String) {
        file = info.file;
      }
      if (info.function instanceof String) {
        fun = info.function;
      }
      return `{"timestamp": "${info.timestamp}",` +
        `"level": "${info.level}",` +
        `"label":"[${label.replace(/(["])/g, "'").replace(/([\n])/g, " ")}]",` +
        `"function": "${fun}",` +
        `"file": "${file}",` +
        `"message": "${message.replace(/(["])/g, "'").replace(/([\n])/g, " ")}"}`;
    })
  );
  // Writes logs of error and warning to error.log
  const errorLog = createLogger({
    level: 'error',
    format: customFormat,
    transports: [
      new winston.transports.File({ filename: './Logs/error.log', level: 'error' }),
    ]
  });
  // Writes logs of verbose to verbose.log
  const verboseLog = createLogger({
    level: 'verbose',
    format: customFormat,
    transports: [
      new winston.transports.File({ filename: './Logs/verbose.log', level: 'verbose' })
    ]
  });
  // Writes logs of info to info.log
  const infoLog = createLogger({
    level: 'info',
    format: customFormat,
    transports: [
      new winston.transports.File({ filename: './Logs/info.log', level: 'info' })
    ]
  });


  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    // Writes logs to console only if it is not in production
    errorLog.add(new winston.transports.Console());
    verboseLog.add(new winston.transports.Console());
    infoLog.add(new winston.transports.Console());
  }
  // else if (process.env.NODE_ENV === 'production') {

  // }

  // placing all loggers in the app context
  app.set('info', infoLog);
  app.set('error', errorLog);
  app.set('verbose', verboseLog);

  app.use(methodOverride());
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  const allowedOrigins = ['http://localhost:3000', 'https://mesoboard-capstone-app.herokuapp.com', 'http://mesoboard-capstone-app.herokuapp.com', 'http://mesoboard-capstone-app.herokuapp.com/3001'];
  const corsOptions = {
    origin: function (origin, callback) {
      // allow requests with no origin 
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not ' +
          'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: 'POST, GET, OPTIONS, PUT, DELETE',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, token, api_key'
  };
  app.use(cors(corsOptions));
  ////// app.use(fileUpload());

  /***************************/
  /* REQUIRE THE ROUTES HERE */
  /***************************/
  require('../routes/users-routes')(app);

  app.use(function (err, req, res, next) {
    let statusCode;

    statusCode = err.httpStatusCode;
    if (statusCode === undefined) {
      // probably an internal class/method/library error probably you are wrong gabe
      statusCode = 500;
      errorLog.log({
        'level': 'error',
        'label': err.message,
        'message': err.stack,
        'function': 'test',
        'file': 'express'
      });
    } else {
      infoLog.log({
        'level': 'info',
        'message': err
      });
    }
    const errorMessage = { "httpStatusCode": err.httpStatusCode, "message": err.message };
    res.status(statusCode).json(errorMessage);
    return res.end();
  });

  // Have Node serve the files for our built React app
  app.use(express.static(path.resolve(__dirname, '../mesoboard-app/build')));

  // All other GET requests not handled before will return our React app
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../mesoboard-app/build', 'index.html'));
  });

  return server;
};
