const path = require('path');
const grpc = require('grpc');
let protoLoader = require('@grpc/proto-loader');

const grpcHelper = require('../grpc-helper');
const PROTO_PATH = path.join(__dirname, '/protos/hello.proto');
const config = {
  ADDRESS: '0.0.0.0',
  PORT: '5000'
};

let packageDefinition = protoLoader.loadSync(PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

let protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
let server = new grpc.Server();

server.addService(protoDescriptor.Hello.service, {
  hello: function (call, callback) {
    let isSay = grpcHelper.analyzeRequest(call.request);

    if (isSay === true) {
      callback(null, grpcHelper.makeReply('Hello!'))
    } else {
      callback(null, grpcHelper.makeReply('Goodbye!'))
    }
  }
});

server.bind(`${config.ADDRESS}:${config.PORT}`, grpc.ServerCredentials.createInsecure());
module.exports = server;