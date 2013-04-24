"use strict";

var fileTypeCreator = require('../src/fileTypeCreator');

var createDefaultTypes = function() {
  return [
    fileTypeCreator.createType(".js"),
    fileTypeCreator.createType('.css'),
    fileTypeCreator.createType('.java')];
};

exports.parse = function(potentialFileTypes) {
  var fileTypes = [],
    targetDirectory = ".",
    dynamicTypes = false;

  potentialFileTypes.forEach(function(fileType) {
    if (fileType.match(/^\.\w+$/)) {
      fileTypes.push(fileTypeCreator.createType(fileType));
    } else if (fileType.match(/^-d:/)) {
      targetDirectory = fileType.replace("-d:", "");
    } else if (fileType.match(/^-dynamicTypes:true/)) {
      dynamicTypes = true;
    }
  });

  if (fileTypes.length === 0 && !dynamicTypes) {
    fileTypes = createDefaultTypes();
  } else if (dynamicTypes) {
    fileTypes = [];
  }

  return {"fileTypes" : fileTypes,
    "targetDirectory" : targetDirectory,
    "dynamicTypes" : dynamicTypes};
};


