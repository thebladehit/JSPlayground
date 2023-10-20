'use strict';

const http = require('node:http');
const fs = require('node:fs');

const { PORT } = require('./config/config.js');

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Work');
}).listen(PORT);