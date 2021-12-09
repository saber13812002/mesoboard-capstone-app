require('dotenv').config()

const config = {
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT
}

console.log(`postgresql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`)
module.exports = {
    connectionString: `postgresql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`,
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