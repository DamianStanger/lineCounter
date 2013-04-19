"use strict";

var parser = require("../src/argumentParser.js"),
    should = require("should");

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

    actualParsedArguments.should.eql(createTypes([".bbb"]));
  });

  it('should return many values, one for each file type specified', function(){
    var actualParsedArguments;

    actualParsedArguments = parser.parse(["aaa", ".bbb", "ccc", ".123", ".eee"]);

    actualParsedArguments.should.eql(createTypes([".bbb", ".123", ".eee"]));
  });

  it('should return nothing if alformed filetypes are passed in', function(){
    var actualParsedArguments;

    actualParsedArguments = parser.parse(["a", "foo.bbb", ".bar.", "a.b.c", ".", "...", "--foo", ".--foo" ]);

    shouldEqlDefaultArray(actualParsedArguments);
  });

});

function shouldEqlDefaultArray(actualParsedArguments) {
  actualParsedArguments.should.eql(createTypes(['.js', '.css', '.java']));
}

function createTypes(arrayOfTypes){
  var types = [];
  arrayOfTypes.forEach(function(type){
    types.push({ext:type, count:0, lines:0});
  });
  return types;
}