_lineCounter_ is a command line driven tool using [node](http://nodejs.org) which will count non empty lines within predefined file types.

## Example
```javascript
node src/main.js .js .txt .md

Would return:
17 2668
.js 15 2663
.txt 1 0
.md 1 5

17 files found in total with 2668 non empty lines
15 javascript files with 2663 lines
1 txt and md file