"use strict";

function FileTypeBuilder(){
  var extensions = [],
      self = this;

  this.build = function(){
    var types = [];
    extensions.forEach(function(extension){
      types.push({ext:extension, count:0, lines:0});
    });
    return types;
  };

  this.withType = function(ext){
    extensions.push(ext);
    return self;
  };

  this.withTypes = function(arrayOfTypes){
    arrayOfTypes.forEach(function(type){
      extensions.push(type);
    });
    return self;
  };
}

module.exports = FileTypeBuilder;