const createError = require('http-errors');
const express = require('express');
const proxy = require('express-http-proxy');
const path = require('path');
const http = require('http');
const cors = require('cors');

const app = express();
const proxyApp = express();
const server = http.createServer(app);
const proxyServer = http.createServer(proxyApp);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.options('*', cors());

app.use('/api/v1', require('./routes/sebak'));
app.use('/api/v1', require('./routes/membership'));

proxyApp.use('/', proxy('https://localhost:2821'));

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  res.status(status).json({
    error: err.message,
  });
});

server.listen(8080);
server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
});

proxyServer.listen(2820);
proxyServer.on('listening', () => {
  const addr = proxyServer.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
});

