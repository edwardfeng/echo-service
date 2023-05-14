const http = require('http');
const { expect } = require('chai');
const { describe } = require('mocha');
const { createEchoServer } = require('./app');

describe('Echo Server', () => {
  let server;

  before(() => {
    server = createEchoServer();
  });

  after(() => {
    server.close();
  });

  it('should echo the payload for /echo', done => {
    const payload = 'Hello, world!';
    const options = {
      host: 'localhost',
      port: 3000,
      path: '/echo',
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = http.request(options, res => {
      let responseBody = '';

      res.setEncoding('utf8');
      res.on('data', chunk => {
        responseBody += chunk;
      });
      res.on('end', () => {
        expect(responseBody).to.equal(payload);
        done();
      });
    });

    req.write(payload);
    req.end();
  });

  it('should return 404 for unknown paths', done => {
    http.get('http://localhost:3000/unknown', res => {
      expect(res.statusCode).to.equal(404);
      done();
    });
  });
});
