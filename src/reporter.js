"use strict";

function Reporter(logger) {
  var reportLogger = logger;

  this.report = function (stats) {
    reportLogger.log(stats.totalNumberOfFiles + " " + stats.totalNumberOfLines);
    stats.fileTypes.forEach(function(filetype) {
      reportLogger.log(filetype.ext + " " + filetype.count + " " + filetype.lines);
    });
  };
}

module.exports = Reporter;