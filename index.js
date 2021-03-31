const config = require('./server/config/config');
const express = require('express');
const path = require('path');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const api = require('./server/router');

(async function () {
    try {
        await mongoose.connect(config.dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('Database is up and running...');

        const app = express();
        app.use(express.json());
        app.use(cookieParser(config.cookieSecret));
        app.use(express.static(path.join(__dirname, '/build')));
        app.use('/static', express.static(path.join(__dirname, 'src/subtitles')));
        app.use(cors());
        app.use('/api', api);

        app.get('/*', (req, res) => {
            res.status(200).sendFile(path.join(__dirname, '/build', 'index.html'));
        });
        app.listen(config.port, console.log(`Listening on port ${config.port}...`));
    } catch (error) {
        console.error(error);
    };
})();