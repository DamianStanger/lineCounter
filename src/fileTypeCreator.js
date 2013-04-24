"use strict";

exports.createType = function(typeExtension) {
  return {ext : typeExtension, count : 0, lines : 0};
};