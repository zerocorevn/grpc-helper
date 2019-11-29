class Client {
  constructor(client) {
    this.caller = client;
  }

  request(func, value) {
    return new Promise((resolve, reject) => {
      this.caller[func](exports.makeReply(value), (err, reply) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(exports.analyzeReply(reply));
        }
      });
    });
  }
}

/**
 * @param {object} client
 */
exports.createClient = (client) => { return new Client(client); }

/**
 * @param {object} reply
 */
exports.analyzeReply = (reply) => { return (JSON.parse(reply.raw)).value; }

/**
 * @param {*} value
 */
exports.makeReply = (value) => { return { raw: JSON.stringify({ value }) }; }

/**
 * @param {object} request - grpc~call.request
 */
exports.analyzeRequest = (request) => { return (JSON.parse(request.raw)).value; }