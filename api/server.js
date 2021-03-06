const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');

const usersRouter = require('../users/users-router');
const authRouter = require('../auth/router');
const restricted = require('../auth/restricted-middleware.js');

const server = express();

const sessionConfig = {
    name: 'monster',
    secret: '42',
    cookie: {
        maxAge: 1000 * 60 * 5,
        secure: false,
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: true,
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/users', restricted, usersRouter);
server.use('/api/auth', authRouter);

server.get('/', (req, res) => {
    res.json({api: 'prodigious'})
})

module.exports = server;