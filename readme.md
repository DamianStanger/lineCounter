_lineCounter_ is a command line driven tool using [node](http://nodejs.org) which will count non empty lines within predefined file types.

You can pass in any number of file types to look for as arguments to the application

## Usage
    node main.js [filetypes] [-d:targetDirectory] [-dynamicTypes:true]

## Example 1
    node main.js .js .txt .md

Would return:
```
17 2668
.js 15 2663
.txt 1 0
.md 1 5
```

Which would represent the following information:
- 17 files found, with 2668 non empty lines in total
- 15 javascript files with a combined count of 2663 none empty lines
- 1 txt and md file

## Example 2
    node main.js -d:c:\code\project .java .js .cs
    node main.js -d:..\project .java .js .cs

This would allow you to run the stats in any folder on the filesystem either with a relative path or an absolute path

## Example 3
    node main.js -dynamicTypes:true

Find stats for all the fileTypes in the current directory

## Tests
The tests were written to be run with mocha, simply ensure mocha is installed globally and type 'mocha --recursive' whilst in the root dir