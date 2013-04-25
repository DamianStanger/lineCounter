/*global require, describe, it, beforeEach*/
'use strict';

var LineCountSync = require("../../src/lineCountSync"),
  fileContentsWith3Lines = "line1\nline2\n\nline3\n",
  fileContentsWith2Lines = "line1\nline2",
  emptyFileContents = "",
  FileTypeBuilder = require('../fileTypeBuilder.js'),
  sinon = require('sinon'),
  path = require('path');

describe('lineCountSync', function() {
  var defaultFileTypes,
    stubReadDirectoryContents,
    stubStatSync,
    stubReadFileSync,
    stubDirectoryReader,
    stubFileReader;

  beforeEach(function() {
    defaultFileTypes = new FileTypeBuilder().withTypes(['.js', '.css', '.java']).build(),
    stubReadDirectoryContents = sinon.stub(),
    stubStatSync = sinon.stub(),
    stubReadFileSync = sinon.stub(),
    stubDirectoryReader = {"readDirectoryContents" : stubReadDirectoryContents},
    stubFileReader = {"statSync" : stubStatSync, "readFileSync" : stubReadFileSync};
  });


  it('should count lines and populate stats on js files', function() {
    var lineCounter = new LineCountSync(stubDirectoryReader, stubFileReader, defaultFileTypes);
    stubReadDirectoryContents.withArgs("my fake directory").returns(["foo.csv", "doh.txt", "bar.js", "doh.h"]);
    stubStatSync.returns({isDirectory : function() {return false; }});
    stubReadFileSync.returns(fileContentsWith3Lines);


    lineCounter.readDirectoryContents('my fake directory');


    lineCounter.getStats().totalNumberOfFiles.should.equal(1);
    lineCounter.getStats().totalNumberOfLines.should.equal(3);
    lineCounter.getStats().fileTypes.should.eql([{ext : '.js', count : 1, lines : 3},
                                                 {ext : '.css', count : 0, lines : 0},
                                                 {ext : '.java', count : 0, lines : 0}]);
  });

  it('should count empty files but not the line count', function() {
    var lineCounter = new LineCountSync(stubDirectoryReader, stubFileReader, defaultFileTypes);
    stubReadDirectoryContents.withArgs("my fake directory").returns(["foo.js"]);
    stubStatSync.returns({isDirectory : function() {return false; }});
    stubReadFileSync.returns(emptyFileContents);


    lineCounter.readDirectoryContents('my fake directory');


    lineCounter.getStats().totalNumberOfFiles.should.equal(1);
    lineCounter.getStats().totalNumberOfLines.should.equal(0);

    lineCounter.getStats().fileTypes.should.eql([{ext : '.js', count : 1, lines : 0},
      {ext : '.css', count : 0, lines : 0},
      {ext : '.java', count : 0, lines : 0}]);
  });

  describe('user defined file types', function() {
    it('should get stats for only js files', function() {
      var fileTypes = new FileTypeBuilder().withType(".js").build(),
        lineCounter = new LineCountSync(stubDirectoryReader, stubFileReader, fileTypes);
      stubReadDirectoryContents.withArgs("my fake directory").returns(["foo.js", "bar.java", "doh.h"]);
      stubStatSync.returns({isDirectory : function() {return false; }});
      stubReadFileSync.returns(fileContentsWith3Lines);


      lineCounter.readDirectoryContents('my fake directory');


      lineCounter.getStats().totalNumberOfFiles.should.equal(1);
      lineCounter.getStats().totalNumberOfLines.should.equal(3);
      lineCounter.getStats().fileTypes.should.eql([{ext : '.js', count : 1, lines : 3}]);
    });

    it('should find stats for random file types', function() {
      var fileTypes = new FileTypeBuilder().withTypes([".js", ".h", ".txt"]).build(),
        lineCounter = new LineCountSync(stubDirectoryReader, stubFileReader, fileTypes);
      stubReadDirectoryContents.withArgs("my fake directory").returns(["foo.h", "bar.java", "doh.h", "boom.txt", "blue.h"]);
      stubStatSync.returns({isDirectory : function() {return false; }});
      stubReadFileSync.returns(fileContentsWith3Lines);


      lineCounter.readDirectoryContents('my fake directory');


      lineCounter.getStats().totalNumberOfFiles.should.equal(4);
      lineCounter.getStats().totalNumberOfLines.should.equal(12);
      lineCounter.getStats().fileTypes.should.eql([
        {ext : '.js', count : 0, lines : 0},
        {ext : '.h', count : 3, lines : 9},
        {ext : '.txt', count : 1, lines : 3}]);
    });
  });

  describe('dynamicTypes', function() {
    it('should find types dynamically', function() {
      var lineCounter = new LineCountSync(stubDirectoryReader, stubFileReader, [], true);
      stubReadDirectoryContents.withArgs(".").returns(["file1.js", "file2.ps1", "file3.js", "file4.bat", "file5.bat", "file6.js"]);
      stubStatSync.returns({isDirectory : function() {return false; }});
      stubReadFileSync.returns(fileContentsWith2Lines);


      lineCounter.readDirectoryContents('.');


      lineCounter.getStats().totalNumberOfFiles.should.equal(6);
      lineCounter.getStats().totalNumberOfLines.should.equal(12);

      lineCounter.getStats().fileTypes.should.eql([
        {ext : '.js', count : 3, lines : 6},
        {ext : '.ps1', count : 1, lines : 2},
        {ext : '.bat', count : 2, lines : 4}]);
    });
  });

  it('should recursively query down the directory tree', function() {
    var lineCounter = new LineCountSync(stubDirectoryReader, stubFileReader, defaultFileTypes);

    stubReadDirectoryContents.withArgs(".").returns(["file1.js", "dir1", "file2.js"]);
    stubReadDirectoryContents.withArgs("dir1").returns(["file3.js", "dir2"]);
    stubReadDirectoryContents.withArgs(path.join("dir1", "dir2")).returns(["file4.css", "file5.js"]);
    stubStatSync.withArgs("dir1").returns({isDirectory : function() {return true; }});
    stubStatSync.withArgs(path.join("dir1", "dir2")).returns({isDirectory : function() {return true; }});
    stubStatSync.withArgs("file1.js").returns({isDirectory : function() {return false; }});
    stubStatSync.withArgs("file2.js").returns({isDirectory : function() {return false; }});
    stubStatSync.withArgs(path.join("dir1", "file3.js")).returns({isDirectory : function() {return false; }});
    stubStatSync.withArgs(path.join("dir1", "dir2", "file4.css")).returns({isDirectory : function() {return false; }});
    stubStatSync.withArgs(path.join("dir1", "dir2", "file5.js")).returns({isDirectory : function() {return false; }});
//  stubStatSync.returns({isDirectory : function() {return false; }});
    stubReadFileSync.returns(emptyFileContents);


    lineCounter.readDirectoryContents('.');


    lineCounter.getStats().totalNumberOfFiles.should.equal(5);
    lineCounter.getStats().totalNumberOfLines.should.equal(0);

    lineCounter.getStats().fileTypes.should.eql([
      {ext : '.js', count : 4, lines : 0},
      {ext : '.css', count : 1, lines : 0},
      {ext : '.java', count : 0, lines : 0}]);
  });
});