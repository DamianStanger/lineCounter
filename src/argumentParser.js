"use strict";

var createType = function(typeExtension) {
  return {ext : typeExtension, count : 0, lines : 0};
};

var createDefaultTypes = function() {
  return [createType(".js"),
    createType('.css'),
    createType('.java')];
};

exports.parse = function(potentialFileTypes) {
  var fileTypes = [],
    targetDirectory = ".";

  potentialFileTypes.forEach(function(fileType) {
    if (fileType.match(/^\.\w+$/)) {
      fileTypes.push(createType(fileType));
    }
    if (fileType.match(/^-d:/)) {
      targetDirectory = fileType.replace("-d:", "");
    }
  });
  if (fileTypes.length === 0) {
    fileTypes = createDefaultTypes();
  }
  return {"fileTypes" : fileTypes, "targetDirectory" : targetDirectory};
};


