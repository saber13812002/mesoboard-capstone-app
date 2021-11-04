// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const configurePostgres = require('./config/postgres');
const configureExpress = require('./config/express');

// Create a new Postgress connection instance
configurePostgres();

// Create a new Express application instance
const app = configureExpress();

// Determine port
const PORT = process.env.PORT || require('./config/config.js').port;

// Use the Express application instance to listen to the '3001' port
try {
  app.listen(PORT, () => {
    // Log the server status to the console
    console.log(`Server running at http://localhost:${PORT}/`);
  });
} catch (err) { console.error(err) }

// Expose our Express application instance for external usage
module.exports = app;
