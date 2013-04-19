/*global module*/
"use strict";

function LineCountSync(directoryReader, fileReader, fileTypes) {
  var totalNumberOfFiles = 0,
    totalNumberOfLines = 0,
    excludeList = ['.git', 'node_modules', '.idea', 'lib'],
    self = this,

    getFileType = function (fileExtension) {
      var types = fileTypes.filter(function (fileType) {
        return fileType.ext === fileExtension;
      });
      return types ? types[0] : null;
    },

    countLinesSync = function (file) {
      var contents = fileReader.readFileSync(file, 'utf8'),
        matches = contents.match(/.*\S+.*/g);
      if (matches) {
        totalNumberOfLines += matches.length;
        return matches.length;
      }
      return 0;
    };

  this.getStats = function () {
    return {"totalNumberOfFiles": totalNumberOfFiles,
      "totalNumberOfLines": totalNumberOfLines,
      "fileTypes": fileTypes};
  };

  this.readDirectoryContents = function (dir) {
    var files = directoryReader.readDirectoryContents(dir),
      stat,
      fileType;

    files.forEach(function (file) {
      var fileExtensionMatch = file.match(/\.\w+$/),
        fileExtension = ".";

      if (fileExtensionMatch) {
        fileExtension = fileExtensionMatch[0];
      }

      if (excludeList.indexOf(file) < 0) {
        file = dir + '\\' + file;
        stat = fileReader.statSync(file);
        if (stat.isDirectory()) {
          self.readDirectoryContents(file);
        } else {
          fileType = getFileType(fileExtension);
          if (fileType) {
            fileType.count += 1;
            totalNumberOfFiles += 1;
            fileType.lines += countLinesSync(file);
          }
        }
      }
    });
  };
}

module.exports = LineCountSync;