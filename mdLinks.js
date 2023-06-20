const { isAbsoluteR, isRelative, isValid, isFileOrDirectory, isMarkdownFile } = require('./index.js');

function mdLinks(route) {
   return {
      isAbsoluteR: isAbsoluteR(route),
      isRelative: isRelative(route),
      isValid: isValid(route),
      isFileOrDirectory: isFileOrDirectory(route),
      isMarkdownFile: isMarkdownFile(route)
   };
}

console.log(mdLinks('C:/Users/USER/Desktop/Proyecto4/DEV006-md-links/README.md'));