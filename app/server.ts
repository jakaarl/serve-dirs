/// <reference path="../typings/main.d.ts" />
'use strict';

import validators = require('./validators');
import http = require('http');

export class Server {

  constructor (private port = 0, private rootPath = process.cwd()) {}

  start(errorHandler: (err: Error) => void) {
    let rootValidator = new validators.RootPathValidator(this.rootPath);
    rootValidator.validate((realRootPath: string, err?: Error) => {
      if (err) {
        errorHandler(err);
        return;
      }
      this.rootPath = realRootPath;
      let server = http.createServer(this.handleRequest);
      server.listen(this.port, () => {
        this.port = server.address().port;
        console.log(`Server started, listening on port: ${ this.port }`);
      });
    });
  }

  // TODO: path -> directory mappings
  // ditch rootPath, but treat mapping dirs as roots to paths inside them
  // enumerate mappings for requests in the order they were defined and
  // pick the first match

  handleRequest(request: http.IncomingMessage, response: http.ServerResponse) {
    //let pathValidator = new validators.ChildPathValidator(this.rootPath, )
    // TODO: get directory root, validate, pipe contents
    console.log(`Request received: ${ request.url }`);
    response.end("OK");
  }

}

let server = new Server();
server.start((err: Error) => {
  console.log(err.message);
});
