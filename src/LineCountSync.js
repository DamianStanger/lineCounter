"use strict";

function LineCountSync (directoryReader, fileReader, fileTypeArray){
    var totalNumberOfFiles = 0,
        totalNumberOfLines = 0,
        excludeList = ['.git', 'node_modules', '.idea', 'lib'],
        fileTypes = [],
        self = this;

    if(!fileTypeArray || fileTypeArray.length < 1){
      console.log("no file type arguments exist, defaulting to node main.js .js .css .java");
      fileTypes = [{ext:'.js', count:0, lines:0},
          {ext:'.css', count:0, lines:0},
          {ext:'.java', count:0, lines:0}];
    }else{
      fileTypeArray.forEach(function(fileType){
        fileTypes.push({ext:fileType, count:0, lines:0});
      });
    }

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
                file = dir + '\\' + file
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
      var returnVal;
      fileTypes.forEach(function(filetype){
          if(fileExtension === filetype.ext){
              returnVal = filetype;
          }
      });
      return returnVal;
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