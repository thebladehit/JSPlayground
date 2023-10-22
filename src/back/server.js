'use strict';

const http = require('node:http');
const fs = require('node:fs').promises;
const path = require('node:path');

const { PORT } = require('./config/config.js');

const allowedUrlPath = {
  '/': path.resolve(__dirname, '..', 'front', 'index.html'),
  '/script.js': path.resolve(__dirname, '..', 'front', 'script.js'),
  '/style.css': path.resolve(__dirname, '..', 'front', 'style.css'),
  '/logo.png': path.resolve(__dirname, '..', 'res', 'logo.png'),
  '/logo.ico': path.resolve(__dirname, '..', 'res', 'logo.ico'),
}

const cache = {};

const mimeTypes = {
  'html': 'text/html',
  'css': 'text/css',
  'js': 'application/javascript',
  'png': 'image/png',
  'ico': 'image/x-icon'
};

const readStatic = async (filePath) => {
  try {
    const data = await fs.readFile(filePath);
    return data;
  } catch (e) {
    console.log(e);
  }
};

const server = http.createServer(async (req, res) => {
  const filePath = allowedUrlPath[req.url];
  if (!filePath) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  let data;
  const cached = cache[req.url];
  if (!cached) {
    data = await readStatic(filePath);
    cache[req.url] = data;
  } else {
    data = cached;
  }
  let contentType;
  if (req.url === '/') {
    contentType = mimeTypes['html'];
  } else {
    const parserUrl = req.url.split('.')
    const ext = parserUrl[parserUrl.length - 1];
    contentType = mimeTypes[ext];
  }
  res.setHeader('Content-Type', contentType);
  res.writeHead(200);
  res.end(data);
}).listen(PORT);