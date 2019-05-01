const express = require('express');
const helmet = require('helmet');
// import routers
const zooRouter = require('./zoo/zoo-router.js');
const bearsRouter = require('./bears/bears-router.js');

const server = express();

server.use(helmet());
server.use(express.json());
// use routers
server.use('/api/zoos', zooRouter);
server.use('/api/bears', bearsRouter);

// Hello msg
server.get('/', (req, res) => {
    res.send({ message: 'Hello from Patty. BE Week2-Day2 Project'})
});

module.exports = server;