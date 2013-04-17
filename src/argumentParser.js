"use strict";

exports.parse = function(potentialFileTypes){
  var fileTypes = [];

  potentialFileTypes.forEach(function(fileType){
    if(fileType.match(/^\.\w+$/)){
      fileTypes.push(fileType);
    }
  });
  return fileTypes;
};
