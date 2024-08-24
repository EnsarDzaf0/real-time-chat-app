require('dotenv').config();
module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.POSTGRES_DB,
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT,
        logging: console.log
    },
    staging: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.POSTGRES_DB,
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false
    },
    production: {
        username: process.env.DB_USER_PROD,
        password: process.env.DB_PASSWORD_PROD,
        database: process.env.POSTGRES_DB_PROD,
        host: process.env.DB_HOST_PROD,
        port: process.env.DB_PORT_PROD,
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
    }
};