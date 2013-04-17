"use strict";

var LineCountSync = require('../src/LineCountSync'),
  directoryReader = require('../src/DirectoryReader'),
  argumentParser = require('../src/argumentParser'),
  fs = require("fs"),
  counter,
  fileTypes;

fileTypes = argumentParser.parse(process.argv);

counter = new LineCountSync(directoryReader, fs, fileTypes);


counter.readDirectoryContents('.');
console.log(counter.getStats().totalNumberOfFiles + " " + counter.getStats().totalNumberOfLines);

counter.getStats().fileTypes.forEach(function(filetype){
  console.log(filetype.ext + " " + filetype.count + " " + filetype.lines);
});
