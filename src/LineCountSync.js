"use strict";

function LineCountSync (){
    var fs = require("fs"),
        totalNumberOfFiles = 0,
        totalNumberOfLines = 0,
        excludeList = ['.git', 'node_modules', '.idea', 'lib'],
        fileTypes = [{ext:'.js', count:0, lines:0},
            {ext:'.css', count:0, lines:0},
            {ext:'.java', count:0, lines:0}],
        self = this;

    this.getStats = function(){
      return {"totalNumberOfFiles":totalNumberOfFiles,
              "totalNumberOfLines":totalNumberOfLines};
    };

    this.readDirectoryContents = function(dir){
        //console.log("dir - " + dir);
        var files = fs.readdirSync(dir);
        files.forEach(function(file){
            //console.log("file - " + file);
            var fileExtensionMatch = file.match(/\.\w+$/);
            var fileExtension = ".";
            if(fileExtensionMatch)
            {
                fileExtension = fileExtensionMatch[0];
            }
            //console.log(fileExtension);
            if(excludeList.indexOf(file)<0){
                file = dir + '\\' + file
                var stat = fs.statSync(file);
    //                console.log('isDir - ' + stat.isDirectory());
    //                console.log('file - ' + file);
    //                console.log('stat - ' + stat);
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
        var contents = fs.readFileSync(file, 'utf8');
        var matches = contents.match(/.*\S+.*/g);
        console.log(file + " - " + matches.length);
        totalNumberOfLines += matches.length;
        return matches.length;
    };

};

module.exports = LineCountSync;