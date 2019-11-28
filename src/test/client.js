const path = require('path');
const grpc = require('grpc');
let protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.join(__dirname, '/protos/hello.proto');
const config = {
  ADDRESS: '0.0.0.0',
  PORT: '5000'
};
const grpcHelper = require('../index');

let packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

let protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

let client = new protoDescriptor.Hello(
  `${config.ADDRESS}:${config.PORT}`, grpc.credentials.createInsecure()
);

module.exports = grpcHelper.createClient(client);