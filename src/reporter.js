"use strict";

function Reporter(logger) {
  var reportLogger = logger;

  this.report = function (stats) {
    reportLogger.log(stats.totalNumberOfFiles + " " + stats.totalNumberOfLines);
    stats.fileTypes.forEach(function(fileType) {
      reportLogger.log(fileType.ext + " " + fileType.count + " " + fileType.lines);
    });
  };
}

module.exports = Reporter;