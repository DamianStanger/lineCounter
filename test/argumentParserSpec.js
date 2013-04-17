"use strict";

var parser = require("../src/argumentParser.js"),
    should = require("should");

describe('argumentParser', function(){
  it('should return an empty array if no arguments to parse', function(){
    var actualParsedArguments;

    actualParsedArguments = parser.parse([]);

    actualParsedArguments.should.be.empty;
  });

  it('should return an empty array if no file type arguments to parse', function(){
    var actualParsedArguments;

    actualParsedArguments = parser.parse(["aaa", "bbb", "ccc"]);

    actualParsedArguments.should.be.empty;
  });

  it('should return one value if one file type is specified', function(){
    var actualParsedArguments;

    actualParsedArguments = parser.parse([".bbb"]);

    actualParsedArguments.should.eql([".bbb"]);
  });

  it('should return many values, one for each file type specified', function(){
    var actualParsedArguments;

    actualParsedArguments = parser.parse(["aaa", ".bbb", "ccc", ".123", ".eee"]);

    actualParsedArguments.should.eql([".bbb", ".123", ".eee"]);
  });

  it('should return nothing if alformed filetypes are passed in', function(){
    var actualParsedArguments;

    actualParsedArguments = parser.parse(["a", "foo.bbb", ".bar.", "a.b.c", ".", "...", "--foo", ".--foo" ]);

    actualParsedArguments.should.be.empty;
  });

});