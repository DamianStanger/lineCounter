_lineCounter_ is a command line driven tool using [node](http://nodejs.org) which will count non empty lines within predefined file types.

You can pass in any number of file types to look for as arguments to the application

## Example
    node src/main.js .js .txt .md

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
