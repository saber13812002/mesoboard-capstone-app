require('dotenv').config()

const config = {
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    post: process.env.PG_PORT
}

console.log(`postgresql://${config.user}:${config.password}@${config.host}:${config.post}/${config.database}`)
module.exports = {
    // db: 'postgresql://admin:meso_2021@localhost:5432/mesodb',
    connectionString: `postgresql://${config.user}:${config.password}@${config.host}:${config.post}/${config.database}`,
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