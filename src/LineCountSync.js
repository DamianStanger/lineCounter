"use strict";

function LineCountSync (directoryReader, fileReader, fileTypes){
    var totalNumberOfFiles = 0,
        totalNumberOfLines = 0,
        excludeList = ['.git', 'node_modules', '.idea', 'lib'],
        self = this;

    this.getStats = function(){
      return {"totalNumberOfFiles":totalNumberOfFiles,
              "totalNumberOfLines":totalNumberOfLines,
              "fileTypes":fileTypes};
    };

    this.readDirectoryContents = function(dir){
        var files = directoryReader.readDirectoryContents(dir);
        files.forEach(function(file){
            var fileExtensionMatch = file.match(/\.\w+$/);
            var fileExtension = ".";
            if(fileExtensionMatch)
            {
                fileExtension = fileExtensionMatch[0];
            }
            if(excludeList.indexOf(file)<0){
                file = dir + '\\' + file;
                var stat = fileReader.statSync(file);
                if(stat.isDirectory()){
                    self.readDirectoryContents(file);
                }else{
                    var fileType = getFileType(fileExtension);
                    if(fileType){
                        fileType.count += 1;
                        totalNumberOfFiles += 1;
                        fileType.lines += countLinesSync(file);
                    }
                }
            }
        });
    };

    var getFileType = function(fileExtension)
    {
      var types = fileTypes.filter(function(fileType){
        return fileType.ext == fileExtension;
      });
      return types ? types[0] : null;
    };

    var countLinesSync = function(file){
      var contents = fileReader.readFileSync(file, 'utf8');
      var matches = contents.match(/.*\S+.*/g);
      if (matches) {
        totalNumberOfLines += matches.length;
        return matches.length;
      }
      return 0;
    };

}

module.exports = LineCountSync;