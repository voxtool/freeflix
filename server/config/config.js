const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        port: process.env.PORT || 5000,
        dbURL: process.env.DB_URL,
        cookieSecret: process.env.COOKIESECRET || 'BigSecret',
        authCookieName: 'auth-token'
    },
    production: {
        port: process.env.PORT || 5000,
        dbURL: process.env.DB_URL,
        cookieSecret: process.env.COOKIESECRET || 'BigSecret',
        authCookieName: 'auth-token'
    }
};

module.exports = config[env];