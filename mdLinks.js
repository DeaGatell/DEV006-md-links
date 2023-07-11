const {  
  convertToAbsolutePath,
  readDir,
  readFileMd,
  validateURLs } = require('./index.js');
  const fs = require('fs');
  const path = require('path');

const pathUser = process.argv[2];

//Proceso de mdLinks
//function mdLinks(path, options) {
  //return new Promise((resolve, reject) => {
    // Verificar y procesar la ruta proporcionada
    // Obtener la lista de archivos o el contenido del archivo Markdown
    // Extraer los enlaces y realizar validaciones si es necesario
    // Devolver los resultados como un arreglo de objetos
  //});
//}

// Función para leer archivos .md
const mdLinks = (pathUser, options = { validate: false }) => {
  return new Promise((resolve, reject) => {
    // Obtener la ruta absoluta
    const absolutePath = convertToAbsolutePath(pathUser);
    let mdFiles = [];

    // Obtener información sobre la ruta especificada
    const stats = fs.statSync(absolutePath);

    if (stats.isDirectory()) {
      // Si la ruta es un directorio, leer los archivos .md dentro de él
      mdFiles = readDir(absolutePath);
    } else if (stats.isFile() && path.extname(absolutePath) === ".md") {
      // Si la ruta es un archivo .md, agregarlo al array de archivos .md
      mdFiles = [absolutePath];
    } else {
      // Si la ruta no es un directorio ni un archivo .md válido, rechazar la promesa con un mensaje de error
      reject("La ruta especificada no es un directorio ni un archivo .md válido.");
      return;
    }

    const promises = mdFiles.map((file) => { //Crea un array de promesas y usa la funcion map para iterar sobre cada elemento del array mdFiles
      return readFileMd(file) //Retorna una promesa que se resuelve en un array de links
        .then((links) => {//El .then maneja la promesa resuelta y toma una funcion callback que recibe el valor resuelto que es el array de links
          if (options.validate) {
            // Si la opción de validación está habilitada, validar los enlaces encontrados
            return validateURLs(links, file);
          } else {
            // Si la opción de validación no está habilitada, devolver los enlaces sin validar
            return links;
          }
        })
        .catch((error) => {
          // Si ocurre un error al leer el archivo .md, rechazar la promesa con el error
          reject(error);
        });
    });

    Promise.all(promises) //Se utiliza el método Promise.all() para manejar un array de promesas llamado promises
      .then((results) => { //Cuando todas las promesas en el array se resuelven, el .then se ejecuta usando un callback
        // Combinar todos los enlaces de los archivos .md en un solo array
        const allLinks = results.flat();
        resolve(allLinks); //Se resuelve el array combinado de links
      })
      .catch((error) => {
        // Si ocurre un error al procesar los enlaces, rechazar la promesa con el error
        reject(error);
      });
  });
};

//En resumen, la función mdLinks recibe una ruta de usuario y opciones como argumentos. 
//La función verifica si la ruta es un directorio o un archivo .md válido, y luego lee los archivos .md encontrados.
//Luego, lee los enlaces dentro de los archivos .md y, si se habilita la opción de validación, valida los enlaces.
//Finalmente, combina todos los enlaces y resuelve la promesa con el resultado.
//Si ocurre algún error durante el proceso, la promesa se rechaza con el error correspondiente.

module.exports = {mdLinks};

