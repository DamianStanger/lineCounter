_lineCounter_ is a command line driven tool using [node](http://nodejs.org) which will count non empty lines within predefined file types.

You can pass in any number of file types to look for as arguments to the application

## Usage
    node main.js [filetypes] [-d:targetDirectory] [-dynamicTypes:true]

## Example 1
    node main.js .js .txt .md

Would return:
```
13 403
.js 11 377
.txt 1 0
.md 1 26
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
Find stats for all the fileTypes in the current directory
    node main.js -dynamicTypes:true

would return:
```
15 431
.js 11 377
.css 0 0
.java 0 0
.gitignore 1 2
.log 1 23
.md 1 29
.txt 1 0
```

## Tests
The tests were written to be run with mocha, simply ensure mocha is installed globally and type 'mocha --recursive' whilst in the root dir

## NOTES
Certain directories are ignored by default and there is currently no way to turn this off or change them at run time. These are:
```
'.git', 'node_modules', '.idea', 'lib'
```

If no file types have been specified and dynamicTypes is off then you get 3 types by default:
```
.js, .css, .java
```