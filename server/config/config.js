const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../', 'example.env') });

const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        port: process.env.PORT || 3000,
        dbURL: process.env.DB_URL,
        cookieSecret: process.env.COOKIESECRET || 'BigSecret',
        authCookieName: 'auth-token'
    },
    production: {
        port: process.env.PORT || 3000,
        dbURL: process.env.DB_URL,
        cookieSecret: process.env.COOKIESECRET || 'BigSecret',
        authCookieName: 'auth-token'
    }
};

module.exports = config[env];