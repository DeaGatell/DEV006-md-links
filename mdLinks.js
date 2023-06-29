const {  
  convertToAbsolutePath,
  readDir,
  readFileMd,
  validateURLs } = require('./util.js');
  const fs = require('fs');
  const path = require('path');

const pathUser = process.argv[2];

function mdLinks(path, options) {
  return new Promise((resolve, reject) => {
    // Verificar y procesar la ruta proporcionada
    // Obtener la lista de archivos o el contenido del archivo Markdown
    // Extraer los enlaces y realizar validaciones si es necesario
    // Devolver los resultados como un arreglo de objetos
  });
}

module.exports = {mdLinks};