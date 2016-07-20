/// <reference path="../typings/index.d.ts" />
'use strict';

import fs = require('fs');

export class RootPathValidator {
  constructor (private rootPath: string) {}

  validate(callback: (rootPath: string, err?: Error) => any) {
    let realRootPath: string;
    fs.realpath(this.rootPath, (err: Error, resolvedPath: string) => {
      if (err) {
        callback(this.rootPath, err);
      }
      realRootPath = resolvedPath;
      fs.stat(realRootPath, (err: Error, stats: fs.Stats) => {
        if (err) {
          callback(realRootPath, err);
        }
        if (!stats.isDirectory()) {
          callback(realRootPath, new Error(`Path ${ realRootPath } is not a directory`));
        }
        fs.access(realRootPath, fs.R_OK, (err?: Error) => {
          if (err) {
            callback(realRootPath, err);
          }
          callback(realRootPath);
        });
      });
    });
  }
}

export class ChildPathValidator {
  constructor (private rootPath: string, private childPath: string) {}

  validate(callback: (rootPath: string, childPath: string, err?: Error) => any) {
    let realChildPath: string;
    fs.realpath(this.childPath, (err: Error, resolvedPath: string) => {
      if (err) {
        callback(this.rootPath, this.childPath, err);
      }
      realChildPath = resolvedPath;
      if (realChildPath.indexOf(this.rootPath) !== 0) {
        callback(this.rootPath, realChildPath,
          new Error(`Path ${ realChildPath } is not a child of ${ this.rootPath }`));
      }
      callback(this.rootPath, realChildPath);
    });
  }
}
