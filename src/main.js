"use strict";

var LineCountSync = require('../src/LineCountSync'),
  directoryReader = require('../src/DirectoryReader'),
  fs = require("fs"),
  counter;

counter = new LineCountSync(directoryReader, fs);


counter.readDirectoryContents('.');
console.log(counter.getStats().totalNumberOfFiles + " " + counter.getStats().totalNumberOfLines);

counter.getStats().fileTypes.forEach(function(filetype){
  console.log(filetype.ext + " " + filetype.count + " " + filetype.lines);
});
