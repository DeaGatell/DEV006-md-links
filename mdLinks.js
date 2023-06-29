const {
  isAbsoluteR,
  isRelative,
  isValid,
  isFileOrDirectory,
  isMarkdownFile,
} = require("./index.js");

// Función que devuelve un objeto con los resultados de las funciones de verificación de la ruta
function functionConfirmation(route) {
  return {
    isAbsoluteR: isAbsoluteR(route),
    isRelative: isRelative(route),
    isValid: isValid(route),
    isFileOrDirectory: isFileOrDirectory(route),
    isMarkdownFile: isMarkdownFile(route),
  };
}

console.log(
  functionConfirmation("C:/Users/USER/Desktop/Proyecto4/DEV006-md-links/README.md")
);

function mdLinks(path, options) {
  return new Promise((resolve, reject) => {
    // Verificar y procesar la ruta proporcionada
    // Obtener la lista de archivos o el contenido del archivo Markdown
    // Extraer los enlaces y realizar validaciones si es necesario
    // Devolver los resultados como un arreglo de objetos
  });
}

// Ejemplo de uso de la función isMarkdownFile con una ruta específica
//const filePath = 'C://Users//USER//Desktop//Proyecto4//DEV006-md-links//contents//prueba.md';

//isMarkdownFile(filePath)
//.then((result) => {
//if (result.isMarkdown) {
//console.log("El archivo es un archivo .md");
//console.log("Enlaces encontrados:");
//result.links.forEach((link) => {
//console.log(`Texto: ${link.text}, URL: ${link.url}`);
//});
//} else {
//console.log(`El archivo no es un archivo .md.`);
//}
//})
//.catch((error) => {
//console.log("Error:", error);
//});
