# Node.js gRPC Helper Module
Support to send requests and reply with data type-protected content for gRPC.
Supported the promise for the Unary call method.

## Proto
```js
syntax = "proto3";

service Hello {
  rpc hello(Request) returns (Reply){}
}

/*
* A message for the return value of a rpc function.
* raw = JSON.stringify({ value: any })
*/
message Reply {
  string raw = 1;
}

/*
* A message for the argument of a rpc function.
* raw = JSON.stringify({ value: any })
*/
message Request {
  string raw = 1;
}
```

## Server
```js
const path = require('path');
const grpc = require('grpc');
let protoLoader = require('@grpc/proto-loader');

const grpcHelper = require('../index');
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
```

## Client
```js
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

let stub = grpcHelper.createClient(client);

stub.request('hello', true).then(message => {
  console.log(message); // Hello!
}).catch(done);
```
## Testing
```bash
npm test
```