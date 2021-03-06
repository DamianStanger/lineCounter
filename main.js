"use strict";

var LineCountSync = require('./src/lineCountSync'),
  directoryReader = require('./src/DirectoryReader'),
  argumentParser = require('./src/argumentParser'),
  Reporter = require('./src/reporter'),
  fs = require("fs"),
  counter,
  commandArguments;

commandArguments = argumentParser.parse(process.argv);

counter = new LineCountSync(directoryReader, fs, commandArguments.fileTypes, commandArguments.dynamicTypes);

counter.readDirectoryContents(commandArguments.targetDirectory);

var consoleReporter = new Reporter(console);
consoleReporter.report(counter.getStats());