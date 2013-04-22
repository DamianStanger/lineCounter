"use strict";

var LineCountSync = require('./src/lineCountSync'),
  directoryReader = require('./src/DirectoryReader'),
  argumentParser = require('./src/argumentParser'),
  Reporter = require('./src/reporter'),
  fs = require("fs"),
  counter,
  commandArguments;


commandArguments = argumentParser.parse(process.argv);

counter = new LineCountSync(directoryReader, fs, commandArguments.fileTypes);

counter.readDirectoryContents(commandArguments.targetDirectory);

new Reporter(console).report(counter.getStats());
