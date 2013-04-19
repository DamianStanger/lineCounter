"use strict";

var parser = require("../src/argumentParser.js"),
    should = require("should"),
    FileTypeBuilder = require('../test/fileTypeBuilder.js');

describe('argumentParser', function(){
  it('should return an default array if no arguments to parse', function(){
    var actualParsedArguments;

    actualParsedArguments = parser.parse([]);

    shouldEqlDefaultArray(actualParsedArguments);
  });

  it('should return default array if no file type arguments to parse', function(){
    var actualParsedArguments;

    actualParsedArguments = parser.parse(["aaa", "bbb", "ccc"]);

    shouldEqlDefaultArray(actualParsedArguments);
  });

  it('should return one value if one file type is specified', function(){
    var actualParsedArguments;

    actualParsedArguments = parser.parse([".bbb"]);

    var bbbType = new FileTypeBuilder().withType(".bbb").build();
    actualParsedArguments.should.eql(bbbType);
  });

  it('should return many values, one for each file type specified', function(){
    var actualParsedArguments;

    actualParsedArguments = parser.parse(["aaa", ".bbb", "ccc", ".123", ".eee"]);

    var threeTypes = new FileTypeBuilder().withTypes([".bbb", ".123", ".eee"]).build();
    actualParsedArguments.should.eql(threeTypes);
  });

  it('should return nothing if alformed filetypes are passed in', function(){
    var actualParsedArguments;

    actualParsedArguments = parser.parse(["a", "foo.bbb", ".bar.", "a.b.c", ".", "...", "--foo", ".--foo" ]);

    shouldEqlDefaultArray(actualParsedArguments);
  });

});

function shouldEqlDefaultArray(actualParsedArguments) {
  var defaultTypes = new FileTypeBuilder().withTypes(['.js', '.css', '.java']).build();
  actualParsedArguments.should.eql(defaultTypes);
};