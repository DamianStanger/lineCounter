"use strict";
var reader = require("../src/directoryReader.js"),
    should = require("should");

describe("directoryReader", function(){

  it('should return nothing if directory is empty', function(){
    reader.readDirectoryContents("./test/testFiles/emptyDirectory/").should.eql({});
  });

  it('should return the file in the directory', function(){
    var directoryContents = [
                              "emptyDirectory",
                              "testFile2.js"
                            ];
    reader.readDirectoryContents("./test/testFiles/").should.eql(directoryContents);
  })

});

