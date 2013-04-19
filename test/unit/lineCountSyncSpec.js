/*global require, describe, it*/
'use strict';

var LineCountSync = require("../../src/lineCountSync"),
  should = require("should"),
  fileContents = "line1\nline2\n\nline3\n",
  emptyFileContents = "",
  FileTypeBuilder = require('../fileTypeBuilder.js'),
  sinon = require('sinon');

describe('lineCountSync', function() {
  var defaultFileTypes;

  beforeEach(function() {
    defaultFileTypes = new FileTypeBuilder().withTypes(['.js', '.css', '.java']).build();
  });

  it('should count lines and populate stats on js files', function() {
    var directoryReader = {"readDirectoryContents" : function() {return ["foo.csv", "doh.txt", "bar.js", "doh.h"]; }},
      fileReader = {"statSync" : function() {
        return {"isDirectory" : function() {return false; }};
      },
        "readFileSync" : function() {return fileContents; }},
      lineCounter = new LineCountSync(directoryReader, fileReader, defaultFileTypes);

    lineCounter.readDirectoryContents('my fake directory');

    lineCounter.getStats().totalNumberOfFiles.should.equal(1);
    lineCounter.getStats().totalNumberOfLines.should.equal(3);
    lineCounter.getStats().fileTypes.should.eql([{ext : '.js', count : 1, lines : 3},
                                                 {ext : '.css', count : 0, lines : 0},
                                                 {ext : '.java', count : 0, lines : 0}]);
  });

  it('should count empty files but not the line count', function() {
    var directoryReader = {"readDirectoryContents" : function() {return ["foo.js"]; }},
      fileReader = {"statSync" : function() {
        return {"isDirectory" : function() {return false; }};
      },
        "readFileSync" : function() {return emptyFileContents; }},
      lineCounter = new LineCountSync(directoryReader, fileReader, defaultFileTypes);

    lineCounter.readDirectoryContents('my fake directory');

    lineCounter.getStats().totalNumberOfFiles.should.equal(1);
    lineCounter.getStats().totalNumberOfLines.should.equal(0);

    lineCounter.getStats().fileTypes.should.eql([{ext : '.js', count : 1, lines : 0},
      {ext : '.css', count : 0, lines : 0},
      {ext : '.java', count : 0, lines : 0}]);
  });

  describe('user defined file types', function() {
    it('should get stats for only js files', function() {
      var directoryReader = {"readDirectoryContents" : function() {return ["foo.js", "bar.java", "doh.h"]; }},
        fileReader = {"statSync" : function() {
          return {"isDirectory" : function() {return false; }};
        },
          "readFileSync" : function() {return fileContents; }
          },
        fileTypes = new FileTypeBuilder().withType(".js").build(),
        lineCounter = new LineCountSync(directoryReader, fileReader, fileTypes);

      lineCounter.readDirectoryContents('my fake directory');

      lineCounter.getStats().totalNumberOfFiles.should.equal(1);
      lineCounter.getStats().totalNumberOfLines.should.equal(3);
      lineCounter.getStats().fileTypes.should.eql([{ext : '.js', count : 1, lines : 3}]);
    });

    it('should find stats for random file types', function() {
      var directoryReader = {"readDirectoryContents" : function() {return ["foo.h", "bar.java", "doh.h", "boom.txt", "blue.h"]; }},
        fileReader = {"statSync" : function() {
          return {"isDirectory" : function() {return false; }};
        },
          "readFileSync" : function() {return fileContents; }},
        fileTypes = new FileTypeBuilder().withTypes([".js", ".h", ".txt"]).build(),
        lineCounter = new LineCountSync(directoryReader, fileReader, fileTypes);

      lineCounter.readDirectoryContents('my fake directory');

      lineCounter.getStats().totalNumberOfFiles.should.equal(4);
      lineCounter.getStats().totalNumberOfLines.should.equal(12);
      lineCounter.getStats().fileTypes.should.eql([
        {ext : '.js', count : 0, lines : 0},
        {ext : '.h', count : 3, lines : 9},
        {ext : '.txt', count : 1, lines : 3}]);
    });
  });

  it('should recursively query down the directory tree', function() {
    var readDirectoryContents = sinon.stub(),
      statSync = sinon.stub(),
      readFileSync = sinon.stub(),
      directoryReader = {"readDirectoryContents" : readDirectoryContents},
      fileReader = {"statSync" : statSync, "readFileSync" : readFileSync},
      lineCounter = new LineCountSync(directoryReader, fileReader, defaultFileTypes);

    readDirectoryContents.withArgs(".").returns(["file1.js", "dir1", "file2.js"]);
    readDirectoryContents.withArgs(".\\dir1").returns(["file3.js", "dir2"]);
    readDirectoryContents.withArgs(".\\dir1\\dir2").returns(["file4.css", "file5.js"]);
    statSync.withArgs(".\\dir1").returns({isDirectory : function() {return true; }});
    statSync.withArgs(".\\dir1\\dir2").returns({isDirectory : function() {return true; }});
    statSync.withArgs(".\\file1.js").returns({isDirectory : function() {return false; }});
    statSync.withArgs(".\\file2.js").returns({isDirectory : function() {return false; }});
    statSync.withArgs(".\\dir1\\file3.js").returns({isDirectory : function() {return false; }});
    statSync.withArgs(".\\dir1\\dir2\\file4.css").returns({isDirectory : function() {return false; }});
    statSync.withArgs(".\\dir1\\dir2\\file5.js").returns({isDirectory : function() {return false; }});
//    statSync.returns({isDirectory : function() {return false; }});
    readFileSync.returns("");

    lineCounter.readDirectoryContents('.');

    lineCounter.getStats().totalNumberOfFiles.should.equal(5);
    lineCounter.getStats().totalNumberOfLines.should.equal(0);

    lineCounter.getStats().fileTypes.should.eql([
      {ext : '.js', count : 4, lines : 0},
      {ext : '.css', count : 1, lines : 0},
      {ext : '.java', count : 0, lines : 0}]);
  });
});