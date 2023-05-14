const http = require('http');

function createEchoServer() {
  const server = http.createServer((req, res) => {
    if (req.url === '/echo') {
      let payload = '';

      req.on('data', chunk => {
        payload += chunk;
      });

      req.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(payload);
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  });

  server.listen(3000, () => {
    console.log('Echo server is listening on port 3000');
  });

  return server;
}

function close(server) {
  server.close(() => {
    console.log('Echo server has been closed');
  });
}

module.exports = { createEchoServer, close };

if (require.main === module) {
  const server = createEchoServer();

  // Gracefully close the server on SIGINT (Ctrl+C)
  process.on('SIGINT', () => {
    close(server);
  });
}
