/// <reference path="../typings/main.d.ts" />
'use strict';

import validators = require('../app/validators');
import fs = require('fs');
var assert = require('chai').assert;

describe('RootPathValidator validate()', () => {
  it('returns error if invalid path', (done: (err?: Error) => void) => {
    let validator = new validators.RootPathValidator("invalidpath");
    validator.validate((realRootPath: string, err?: Error) => {
      assert.isDefined(err);
      assert.isTrue(err.message.indexOf("ENOENT") === 0);
      done();
    });
  });

  it('returns error if not a directory', (done: (err?: Error) => void) => {
    let validator = new validators.RootPathValidator("./package.json");
    validator.validate((realRootPath: string, err?: Error) => {
      assert.isDefined(err);
      assert.equal(`Path ${ realRootPath } is not a directory`, err.message);
      done();
    });
  });

  it('returns real path and no error', (done: (err?: Error) => void) => {
    let validator = new validators.RootPathValidator("./");
    let expectedPath = process.cwd();
    validator.validate((realRootPath: string, err?: Error) => {
      assert.isUndefined(err);
      assert.equal(expectedPath, realRootPath);
      done();
    });
  });
});

describe('ChildPathValidator validate()', () => {
  it('returns error if invalid path', (done: (err?: Error) => void) => {
    let validator = new validators.ChildPathValidator("./", "invalidpath");
    validator.validate((rootPath: string, realChildPath: string, err?: Error) => {
      assert.isDefined(err);
      assert.isTrue(err.message.indexOf("ENOENT") === 0);
      done();
    });
  });

  it('returns error if not child path', (done: (err?: Error) => void) => {
    let rootPath = process.cwd();
    let validator = new validators.ChildPathValidator(rootPath, "../");
    validator.validate((rootPath: string, realChildPath: string, err?: Error) => {
      assert.isDefined(err);
      assert.equal(`Path ${ realChildPath } is not a child of ${ rootPath }`, err.message);
      done();
    });
  });

  it('returns real path and no error', (done: (err?: Error) => void) => {
    let rootPath = process.cwd();
    let expectedRealPath = fs.realpathSync("./package.json");
    let validator = new validators.ChildPathValidator(rootPath, "./package.json");
    validator.validate((rootPath: string, realChildPath: string, err?: Error) => {
      assert.isUndefined(err);
      assert.equal(expectedRealPath, realChildPath);
      done();
    });
  });
});
