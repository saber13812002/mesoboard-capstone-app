// Set the 'production' environment configuration object
module.exports = {
    db: 'postgres://iapadmin:iap_2021@iap.ece.uprm.edu:5432/iap',
    SECRET_KEY: 'SuperSecretKeyThatNoOneCanCrackLOL',
    mailServiceCredentials: {
        name: 'IAP Development Team',
        email: 'ipappteam@gmail.com',
        password: 'spring2016',
        ssl: true,
        host: 'smtp.gmail.com',
        port: 465,
        authentication: 'login',
    },
    port: 3000,
};
