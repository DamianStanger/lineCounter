"use strict";

var lineCountSync = require('../src/LineCountSync').LineCountSync();



lineCountSync.readDirectoryContents('.');
console.log(lineCountSync.totalNumberOfFiles + " " + lineCountSync.totalNumberOfLines);

lineCountSync.fileTypes.forEach(function(filetype){
  console.log(filetype.ext + " " + filetype.count + " " + filetype.lines);
});
