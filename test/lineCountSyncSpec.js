'use strict';

var assert = require("assert"),
  LineCountSync = require("../src/LineCountSync");

describe('lineCountSync', function(){
  var lineCounter;

  beforeEach(function(){
    lineCounter = new LineCountSync();
  });


  it('should count lines', function() {
    lineCounter.readDirectoryContents('test/testFiles/');
    assert.equal(lineCounter.getStats().totalNumberOfFiles, 1);
    assert.equal(lineCounter.getStats().totalNumberOfLines, 3);
  });
});
