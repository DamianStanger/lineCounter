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

    actualParsedArguments = parser.parse([]).fileTypes;

    shouldEqlDefaultArray(actualParsedArguments);
  });

  it('should return default array if no file type arguments to parse', function() {
    var actualParsedArguments;

    actualParsedArguments = parser.parse(["aaa", "bbb", "ccc"]).fileTypes;

    shouldEqlDefaultArray(actualParsedArguments);
  });

  it('should return one value if one file type is specified', function() {
    var actualParsedArguments,
      bbbType = new FileTypeBuilder().withType(".bbb").build();

    actualParsedArguments = parser.parse([".bbb"]).fileTypes;

    actualParsedArguments.should.eql(bbbType);
  });

  it('should return many values, one for each file type specified', function() {
    var actualParsedArguments,
      threeTypes = new FileTypeBuilder().withTypes([".bbb", ".123", ".eee"]).build();

    actualParsedArguments = parser.parse(["aaa", ".bbb", "ccc", ".123", ".eee"]).fileTypes;

    actualParsedArguments.should.eql(threeTypes);
  });

  it('should return nothing if malformed file types are passed in', function() {
    var actualParsedArguments;

    actualParsedArguments = parser.parse(["a", "foo.bbb", ".bar.", "a.b.c", ".", "...", "--foo", ".--foo" ]).fileTypes;

    shouldEqlDefaultArray(actualParsedArguments);
  });

  describe('target Directory', function() {
    it('should default to the current directory', function() {
      var parsedArguments;

      parsedArguments = parser.parse(["node", "main.js", ".java", ".js"]);

      parsedArguments.should.have.property("targetDirectory", ".");
    });

    it('should default to the specified absolute directory', function() {
      var parsedArguments;

      parsedArguments = parser.parse(["node", "main.js", "-d:c:\\dir1\\dir2", ".java", ".js"]);

      parsedArguments.should.have.property("targetDirectory", "c:\\dir1\\dir2");
    });
  });

  describe('dynamic type flag', function() {
    it('should be false by default', function () {
      var parsedArguments;

      parsedArguments = parser.parse(["node", "main.js"]);

      parsedArguments.should.have.property("dynamicTypes", false);
    });

    it('should be true', function () {
      var parsedArguments;

      parsedArguments = parser.parse(["node", "main.js", "-dynamicTypes:true"]);

      parsedArguments.should.have.property("dynamicTypes", true);
    });

    it('when set should not use the fileTypes passed in', function() {
      var parsedArguments;

      parsedArguments = parser.parse(["node", "main.js", ".foo", "-dynamicTypes:true", ".bar"]);

      parsedArguments.should.have.property("dynamicTypes", true);
      parsedArguments.fileTypes.should.eql([]);
    });
  });
});
