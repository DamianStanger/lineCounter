"use strict";
var fs = require("fs"),
	lazy = require("lazy"),
	totalNumberOfFiles = 0,
	totalNumberOfLines = 0,
	excludeList = ['.git', 'node_modules', '.idea'],
	fileTypes = ['.js', '.css'];

function readDirectoryContents(dir){
	fs.readdir(dir, function(err, files){
		files.forEach(function(file){
			// console.log(file);
			var fileExtensionMatch = file.match(/\.[\w]+$/);
			var fileExtension = ".";
			if(fileExtensionMatch)
			{
				fileExtension = fileExtensionMatch[0];
			}
			// console.log(fileExtension);
			if(excludeList.indexOf(file)<0 && fileTypes.indexOf(fileExtension)>-1){
				file = dir + '\\' + file
				fs.stat(file, function(err, stat){
					// console.log(stat.isDirectory());
					// console.log(file);
					// console.log(stat);				
					if(stat.isDirectory()){
						readDirectoryContents(file);
					}else{
						totalNumberOfFiles += 1;
						countLines(file);				
					}
				});
			}
		});
	});
}

function countLines(file){
	var numberOfLines = 0;
	new lazy(fs.createReadStream(file))
    	.lines
     	.forEach(function(line){
         	numberOfLines += 1;
         	// console.log(line);
     	}).on('end', function() {
     		console.log(file + " - " + numberOfLines)
     		totalNumberOfLines += numberOfLines;
     	});
     return numberOfLines;
}

readDirectoryContents('.');

setInterval(function(){
	console.log(totalNumberOfFiles + " " + totalNumberOfLines);
}, 1000);