const express = require('express');
const helmet = require('helmet');

const zooRouter = require('./zoo/zoo-router.js');

const server = express();

server.use(helmet());
server.use(express.json());

server.use('/api/zoo', zooRouter);

module.exports = server;