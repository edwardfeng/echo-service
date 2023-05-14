const http = require('http');

function createEchoServer() {
  const server = http.createServer((req, res) => {
    if (req.url === '/echo') {
      let payload = '';
      req.on('data', chunk => {
        payload += chunk;
      });
      req.on('end', () => {
        res.setHeader('Content-Type', 'text/plain');
        res.end(payload);
      });
    } else {
      res.statusCode = 404;
      res.end('Not Found');
    }
  });

  server.listen(3000, () => {
    console.log('Echo server listening on port 3000');
  });

  return server;
}

function close(server) {
  server.close(() => {
    console.log('Echo server closed');
  });
}

if (require.main === module) {
  const echoServer = createEchoServer();

  // Close the server after 10 seconds for testing purposes
  setTimeout(() => {
    close(echoServer);
  }, 10000);
}

module.exports = { createEchoServer, close };
