/*global require*/
"use strict";

var fs = require("fs");

exports.readDirectoryContents = function (directoryToRead) {
  return fs.readdirSync(directoryToRead);
};
