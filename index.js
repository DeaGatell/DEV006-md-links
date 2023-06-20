//Function which determines if the path is absolute
const path = require('path');
const fs = require('fs');

function isAbsoluteR(route) {
  try {
    const convertedRoute = path.normalize(route);
    return path.isAbsolute(convertedRoute);
  } catch (error) {
    console.log('Error: ', error);
  }
}

function isRelative(route) {
  try {
    return path.resolve(route);
  } catch (error) {
    console.log('Error: ', error);
  }
}

function isValid(route) {
  try {
    const isAbsolute = isAbsoluteR(route);
    const isRel = isRelative(route);
    const resolvedRoute = isAbsolute ? route : isRel;
    fs.accessSync(resolvedRoute); // Verificar la existencia del archivo o directorio
    return true;
  } catch (error) {
    console.log('Error:', error);
    return false;
  }
}

function isFileOrDirectory(route) {
  try {
    const resolvedRoute = path.resolve(route);
    const stats = fs.statSync(resolvedRoute);

    if (stats.isFile()) {
      return 'Archivo';
    } else if (stats.isDirectory()) {
      return 'Directorio';
    } else {
      return 'Desconocido';
    }
  } catch (error) {
    console.log('Error:', error);
    return 'Error';
  }
}

function isMarkdownFile(route) {
  try {
    const extname = path.extname(route);
    return extname === '.md';
  } catch (error) {
    console.log('Error:', error);
    return false;
  }
}

const filePath = './README.md';
const fileStatus = isFileOrDirectory(filePath);

if (fileStatus === 'Archivo') {
  if (isMarkdownFile(filePath)) {
    console.log('El archivo es un archivo .md');
  } else {
    console.log('El archivo no es un archivo .md');
    console.log([]); // Devolver un array vacío
  }
} else {
  console.log('La ruta no corresponde a un archivo');
}

module.exports = {
  isAbsoluteR,
  isRelative,
  isValid,
  isFileOrDirectory,
  isMarkdownFile
};
