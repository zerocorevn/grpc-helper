const { describe, it } = require('mocha');
const assert = require('assert');
const client = require('./client');
const server = require('./server');

server.start();

describe('Hello service', () => {
  describe('hello', () => {
    it('Hello --> Hello!', (done) => {
      client.request('hello', true).then(message => {
        assert.equal(message, 'Hello!');
        done();
      }).catch(done);
    });

    it('Hello --> Goodbye!', (done) => {
      client.request('hello', false).then(message => {
        assert.equal(message, 'Goodbye!');
        done();
      }).catch(done);
    });
  });
});