"use strict";

exports.parse = function(potentialFileTypes){
  var fileTypes = [];

  potentialFileTypes.forEach(function(fileType){
    if(fileType.match(/^\.\w+$/)){
      fileTypes.push(createType(fileType));
    }
  });
  if(fileTypes.length===0){
    fileTypes = createDefaultTypes();
  }
  return fileTypes;
};

var createDefaultTypes = function(){
  return [createType(".js"),
    createType('.css'),
    createType('.java')];
};

var createType = function(typeExtension){
  return {ext:typeExtension, count:0, lines:0}
};
