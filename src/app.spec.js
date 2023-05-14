const assert = require('assert');
const http = require('http');
const { createEchoServer, close } = require('./app');

describe('Echo Server', () => {
  let server;

  beforeEach(() => {
    server = createEchoServer();
  });

  afterEach(() => {
    close(server);
  });

  it('should return the payload', (done) => {
    const payload = 'Hello, World!';
    const options = {
      host: 'localhost',
      port: 3000,
      path: '/echo',
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Content-Length': payload.length
      }
    };

    const req = http.request(options, (res) => {
      let receivedPayload = '';

      res.on('data', (chunk) => {
        receivedPayload += chunk;
      });

      res.on('end', () => {
        assert.strictEqual(receivedPayload, payload);
        done();
      });
    });

    req.write(payload);
    req.end();
  });

  it('should return "Not Found" for other routes', (done) => {
    const options = {
      host: 'localhost',
      port: 3000,
      path: '/other',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let receivedPayload = '';

      res.on('data', (chunk) => {
        receivedPayload += chunk;
      });

      res.on('end', () => {
        assert.strictEqual(res.statusCode, 404);
        assert.strictEqual(receivedPayload, 'Not Found');
        done();
      });
    });

    req.end();
  });
});
