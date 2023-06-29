const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
pathUser = process.argv[2];

//Confirmar si la ruta existe
const pathExists = (pathUser) => {
  if (fs.existsSync(pathUser)) {
    return true;
  } else {
    return false;
  }
};

//Verificar si la ruta es absoluta, si es relativa convertirla a absoluta
const convertToAbsolutePath = (pathUser) => {
  if (path.isAbsolute(pathUser)) {
    return pathUser;
  } else {
    return path.resolve(process.cwd(), pathUser);
  }
};

// Función que verifica si la ruta corresponde a un archivo o directorio
function isFileOrDirectory(route) {
  try {
    const resolvedRoute = path.resolve(route); // Resuelve la ruta proporcionada para obtener la ruta absoluta
    const stats = fs.statSync(resolvedRoute); // Obtiene información sobre el archivo o directorio en la ruta resuelta

    if (stats.isFile()) {
      // Comprueba si el objeto stats corresponde a un archivo
      return "Archivo"; // Devuelve el string 'Archivo' si es un archivo
    } else if (stats.isDirectory()) {
      // Comprueba si el objeto stats corresponde a un directorio
      const files = fs.readdirSync(resolvedRoute); // Obtiene la lista de archivos en el directorio
      return files.map((file) => path.join(resolvedRoute, file)); // Devuelve un array con las rutas absolutas de los archivos en el directorio
    }
  } catch (error) {
    console.log("Error:", error); // Muestra el mensaje de error en la consola en caso de que se produzca una excepción
    return "Error"; // Devuelve el string 'Error' si se produce un error
  }
}
//Prueba de isFileOrDirectory
//console.log(isFileOrDirectory('C://Users//USER//Desktop//Proyecto4//DEV006-md-links//mock-directory'));

// Función que verifica si el archivo es un archivo Markdown y extrae los enlaces
function isMarkdownFile(route) {
  return new Promise((resolve, reject) => {
    const extname = path.extname(route); // Obtiene la extensión del archivo en la ruta especificada

    if (extname === ".md") {
      // Comprueba si la extensión es ".md" (archivo Markdown)
      fs.readFile(route, "utf8", (error, content) => {
        if (error) {
          console.log("Error:", error);
          reject(error); // Rechaza la promesa si ocurre un error al leer el archivo
        } else {
          const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g; // Expresión regular para encontrar los enlaces en el contenido
          const links = [];
          let match;
          while ((match = linkRegex.exec(content))) {
            // Busca coincidencias de enlaces en el contenido usando la expresión regular
            const [, text, url] = match; // Extrae el texto y la URL del enlace
            links.push({ text, url }); // Agrega el enlace al array de enlaces
          }

          resolve({
            isMarkdown: true,
            links,
          }); // Resuelve la promesa con el objeto de resultado
        }
      });
    } 
  });
}
//Prueba de isMarkdownFile
//console.log(isMarkdownFile("C://Users//USER//Desktop//Proyecto4//DEV006-md-links//mock-directory//mockREADME.md"));

module.exports = {
  isAbsoluteR,
  isRelative,
  isValid,
  isFileOrDirectory,
  isMarkdownFile,
};
