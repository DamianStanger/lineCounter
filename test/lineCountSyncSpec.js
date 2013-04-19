'use strict';

var assert = require("assert"),
  LineCountSync = require("../src/lineCountSync"),
  should = require("should"),
  fileContents = "line1\nline2\n\nline3\n",
  emptyFileContents = "",
  FileTypeBuilder = require('../test/fileTypeBuilder.js');

describe('lineCountSync', function(){
  var defaultFileTypes;

  beforeEach(function(){
    defaultFileTypes = new FileTypeBuilder().withTypes(['.js', '.css', '.java']).build();
  });

  it('should count lines and populate global stats', function() {
    var directoryReader = {"readDirectoryContents":function(){return ["foo.js", "bar.js"];}},
        fileReader = {"statSync":function(){
          return {"isDirectory":function(){return false;}};},
          "readFileSync":function(){return fileContents;}
        },
        lineCounter = new LineCountSync(directoryReader, fileReader, defaultFileTypes);

    lineCounter.readDirectoryContents('my fake directory');

    lineCounter.getStats().totalNumberOfFiles.should.equal(2);
    lineCounter.getStats().totalNumberOfLines.should.equal(6);
  });

  it('should count lines and populate stats on js files', function() {
    var directoryReader = {"readDirectoryContents":function(){return ["foo.csv", "doh.txt", "bar.js", "doh.h"];}},
        fileReader = {"statSync":function(){
          return {"isDirectory":function(){return false;}};},
          "readFileSync":function(){return fileContents;}
        },
        lineCounter = new LineCountSync(directoryReader, fileReader, defaultFileTypes);

    lineCounter.readDirectoryContents('my fake directory');

    lineCounter.getStats().totalNumberOfFiles.should.equal(1);
    lineCounter.getStats().totalNumberOfLines.should.equal(3);
    lineCounter.getStats().fileTypes.should.eql([{ext:'.js', count:1, lines:3},
                                                 {ext:'.css', count:0, lines:0},
                                                 {ext:'.java', count:0, lines:0}]);
  });

  it('should count lines and populate stats on java files', function() {
    var directoryReader = {"readDirectoryContents":function(){return ["foo.java", "doh.txt", "bar.java", "doh.h"];}},
        fileReader = {"statSync":function(){
          return {"isDirectory":function(){return false;}};},
          "readFileSync":function(){return fileContents;}
        },
        lineCounter = new LineCountSync(directoryReader, fileReader, defaultFileTypes);

    lineCounter.readDirectoryContents('my fake directory');

    lineCounter.getStats().totalNumberOfFiles.should.equal(2);
    lineCounter.getStats().totalNumberOfLines.should.equal(6);
    lineCounter.getStats().fileTypes.should.eql([{ext:'.js', count:0, lines:0},
      {ext:'.css', count:0, lines:0},
      {ext:'.java', count:2, lines:6}]);
  });

  it('should count empty files but not the line count', function() {
    var directoryReader = {"readDirectoryContents":function(){return ["foo.js"];}},
      fileReader = {"statSync":function(){
        return {"isDirectory":function(){return false;}};},
        "readFileSync":function(){return emptyFileContents;}
      },
      lineCounter = new LineCountSync(directoryReader, fileReader, defaultFileTypes);

    lineCounter.readDirectoryContents('my fake directory');

    lineCounter.getStats().totalNumberOfFiles.should.equal(1);
    lineCounter.getStats().totalNumberOfLines.should.equal(0);

    lineCounter.getStats().fileTypes.should.eql([{ext:'.js', count:1, lines:0},
      {ext:'.css', count:0, lines:0},
      {ext:'.java', count:0, lines:0}]);
  });

  describe('user defined file types', function(){
    it('should get stats for only js files', function(){
      var directoryReader = {"readDirectoryContents":function(){return ["foo.js", "bar.java", "doh.h"];}},
          fileReader = {"statSync":function(){
            return {"isDirectory":function(){return false;}};},
            "readFileSync":function(){return fileContents;}
          },
          fileTypes = new FileTypeBuilder().withType(".js").build(),
          lineCounter = new LineCountSync(directoryReader, fileReader, fileTypes);

      lineCounter.readDirectoryContents('my fake directory');

      lineCounter.getStats().totalNumberOfFiles.should.equal(1);
      lineCounter.getStats().totalNumberOfLines.should.equal(3);
      lineCounter.getStats().fileTypes.should.eql([{ext:'.js', count:1, lines:3}]);
    });

    it('should find stats for random file types', function(){
      var directoryReader = {"readDirectoryContents":function(){return ["foo.h", "bar.java", "doh.h", "boom.txt", "blue.h"];}},
        fileReader = {"statSync":function(){
          return {"isDirectory":function(){return false;}};},
          "readFileSync":function(){return fileContents;}
        },
        fileTypes = new FileTypeBuilder().withTypes([".js", ".h", ".txt"]).build(),
        lineCounter = new LineCountSync(directoryReader, fileReader, fileTypes);

      lineCounter.readDirectoryContents('my fake directory');

      lineCounter.getStats().totalNumberOfFiles.should.equal(4);
      lineCounter.getStats().totalNumberOfLines.should.equal(12);
      lineCounter.getStats().fileTypes.should.eql([{ext:'.js', count:0, lines:0},
        {ext:'.h', count:3, lines:9},{ext:'.txt', count:1, lines:3}]);
    });
  })
});