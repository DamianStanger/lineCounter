"use strict";

var LineCountSync = require('./src/lineCountSync'),
  directoryReader = require('./src/DirectoryReader'),
  argumentParser = require('./src/argumentParser'),
  fs = require("fs"),
  counter,
  commandArguments;

commandArguments = argumentParser.parse(process.argv);

counter = new LineCountSync(directoryReader, fs, commandArguments.fileTypes);

counter.readDirectoryContents(commandArguments.targetDirectory);

console.log(counter.getStats().totalNumberOfFiles + " " + counter.getStats().totalNumberOfLines);
counter.getStats().fileTypes.forEach(function(filetype) {
  console.log(filetype.ext + " " + filetype.count + " " + filetype.lines);
});
