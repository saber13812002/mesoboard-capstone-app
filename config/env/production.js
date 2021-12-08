require('dotenv').config()

// Set the 'production' environment configuration object
module.exports = {
    connectionString: process.env.DATABASE_URL, //heroku addons
    mailServiceCredentials: {
        name: 'Mesoboard Development Team',
        email: 'kevjramirez@gmail.com',
        password: 'Bestlife!8',
        ssl: true,
        host: 'smtp.gmail.com',
        port: 465,
        authentication: 'login'
    },
    port: 3001
};
