/*global describe, it*/
"use strict";

var parser = require("../../src/argumentParser.js"),
  should = require("should"),
  FileTypeBuilder = require('../fileTypeBuilder.js');

function shouldEqlDefaultArray(actualParsedArguments) {
  var defaultTypes = new FileTypeBuilder().withTypes(['.js', '.css', '.java']).build();
  actualParsedArguments.should.eql(defaultTypes);
}

describe('argumentParser', function() {
  it('should return an default array if no arguments to parse', function() {
    var actualParsedArguments;

    actualParsedArguments = parser.parse([]);

    shouldEqlDefaultArray(actualParsedArguments);
  });

  it('should return default array if no file type arguments to parse', function() {
    var actualParsedArguments;

    actualParsedArguments = parser.parse(["aaa", "bbb", "ccc"]);

    shouldEqlDefaultArray(actualParsedArguments);
  });

  it('should return one value if one file type is specified', function() {
    var actualParsedArguments,
      bbbType = new FileTypeBuilder().withType(".bbb").build();

    actualParsedArguments = parser.parse([".bbb"]);

    actualParsedArguments.should.eql(bbbType);
  });

  it('should return many values, one for each file type specified', function() {
    var actualParsedArguments,
      threeTypes = new FileTypeBuilder().withTypes([".bbb", ".123", ".eee"]).build();

    actualParsedArguments = parser.parse(["aaa", ".bbb", "ccc", ".123", ".eee"]);

    actualParsedArguments.should.eql(threeTypes);
  });

  it('should return nothing if malformed file types are passed in', function() {
    var actualParsedArguments;

    actualParsedArguments = parser.parse(["a", "foo.bbb", ".bar.", "a.b.c", ".", "...", "--foo", ".--foo" ]);

    shouldEqlDefaultArray(actualParsedArguments);
  });

});
