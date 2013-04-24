/*global module*/
"use strict";

var fileTypeCreator = require('../src/fileTypeCreator');

function LineCountSync(directoryReader, fileReader, fileTypes, dynamicTypes) {

  var path = require('path'),
    totalNumberOfFiles = 0,
    totalNumberOfLines = 0,
    excludeList = ['.git', 'node_modules', '.idea', 'lib'],
    self = this,
    fileExtensionRegex = /\.\w+$/,
    linesWithAtLeastOneNonSpaceCharacterRegex = /.*\S+.*/g,


  createNewFileType = function(fileExtension) {
      var newType = fileTypeCreator.createType(fileExtension);
      fileTypes.push(newType);
      return newType;
    },

    getFileType = function (fileExtension) {
      var types = fileTypes.filter(function (fileType) {
          return fileType.ext === fileExtension;
        });
      if (!(types && types[0]) && dynamicTypes) {
        return createNewFileType(fileExtension);
      }
      return types ? types[0] : null;
    },

    countLinesSync = function (file) {
      var contents = fileReader.readFileSync(file, 'utf8'),
        matches = contents.match(linesWithAtLeastOneNonSpaceCharacterRegex);
      if (matches) {
        totalNumberOfLines += matches.length;
        return matches.length;
      }
      return 0;
    },

    includeThisFile = function (file) {
      return excludeList.indexOf(file) < 0;
    },

    countFileStats = function (fileExtension, file) {
      var fileType = getFileType(fileExtension);
      if (fileType) {
        fileType.count += 1;
        totalNumberOfFiles += 1;
        fileType.lines += countLinesSync(file);
      }
    };

  this.getStats = function () {
    return {"totalNumberOfFiles": totalNumberOfFiles,
      "totalNumberOfLines": totalNumberOfLines,
      "fileTypes": fileTypes};
  };

  this.readDirectoryContents = function (dir) {
    var files = directoryReader.readDirectoryContents(dir),
      stat;

    files.forEach(function (file) {
      var fileExtensionMatch = file.match(fileExtensionRegex),
        fileExtension = ".";

      if (fileExtensionMatch) {
        fileExtension = fileExtensionMatch[0];
      }

      if (includeThisFile(file)) {
        file = path.join(dir, file);
        stat = fileReader.statSync(file);
        if (stat.isDirectory()) {
          self.readDirectoryContents(file);
        } else {
          countFileStats(fileExtension, file);
        }
      }
    });
  };
}

module.exports = LineCountSync;