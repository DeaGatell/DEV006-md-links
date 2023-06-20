const path = require("path");
const fs = require("fs");

// Función que determina si la ruta es absoluta
function isAbsoluteR(route) {
  try {
    const convertedRoute = path.normalize(route); // Normaliza la ruta para asegurarse de que esté en el formato correcto
    return path.isAbsolute(convertedRoute); // Verifica si la ruta es absoluta
  } catch (error) {
    console.log("Error: ", error); // Si se produce un error, muestra el mensaje de error en la consola
  }
}

// Función que convierte la ruta en una ruta absoluta
function isRelative(route) {
  try {
    return path.resolve(route); // Resuelve la ruta relativa a una ruta absoluta
  } catch (error) {
    console.log("Error: ", error); // Si se produce un error, muestra el mensaje de error en la consola
  }
}

// Función que verifica si la ruta es válida (existe un archivo o directorio)
function isValid(route) {
  try {
    const isAbsolute = isAbsoluteR(route); // Verifica si la ruta es absoluta
    const isRel = isRelative(route); // Resuelve la ruta relativa a una ruta absoluta
    const resolvedRoute = isAbsolute ? route : isRel; // Utiliza la ruta absoluta si es absoluta, de lo contrario utiliza la ruta resuelta
    fs.accessSync(resolvedRoute); // Verifica la existencia del archivo o directorio sincrónicamente
    return true; // Devuelve true si la ruta es válida y existe
  } catch (error) {
    console.log("Error:", error); // Si se produce un error, muestra el mensaje de error en la consola
    return false; // Devuelve false si la ruta no es válida o no existe
  }
}

// Función que verifica si la ruta corresponde a un archivo o directorio
function isFileOrDirectory(route) {
  try {
    const resolvedRoute = path.resolve(route); // Resuelve la ruta para obtener una ruta absoluta
    const stats = fs.statSync(resolvedRoute); // Obtiene información sobre el archivo o directorio en la ruta especificada

    if (stats.isFile()) { // Comprueba si es un archivo
      return "Archivo"; // Devuelve "Archivo" si es un archivo
    } else if (stats.isDirectory()) { // Comprueba si es un directorio
      return "Directorio"; // Devuelve "Directorio" si es un directorio
    } else {
      return "Desconocido"; // Devuelve "Desconocido" si no es ni un archivo ni un directorio
    }
  } catch (error) {
    console.log("Error:", error); // Si se produce un error, muestra el mensaje de error en la consola
    return "Error"; // Devuelve "Error" si se produce un error durante el proceso
  }
}

// Función que verifica si el archivo es un archivo Markdown y extrae los enlaces
function isMarkdownFile(route) {
  try {
    const extname = path.extname(route); // Obtiene la extensión del archivo en la ruta especificada
    if (extname === ".md") { // Comprueba si la extensión es ".md" (archivo Markdown)
      return new Promise((resolve, reject) => {
        fs.readFile(route, "utf8", (error, content) => {
          if (error) {
            console.log("Error:", error); // Si se produce un error al leer el archivo, muestra el mensaje de error en la consola
            reject(error); // Rechaza la promesa con el error
          } else {
            const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g; // Expresión regular para encontrar los enlaces en el contenido
            const links = [];
            let match;
            while ((match = linkRegex.exec(content))) { // Busca coincidencias de enlaces en el contenido usando la expresión regular
              const [, text, url] = match; // Extrae el texto y la URL del enlace
              links.push({ text, url }); // Agrega el enlace al array de enlaces
            }
            resolve(links); // Resuelve la promesa con el array de enlaces encontrados
          }
        });
      });
    }
    return Promise.resolve([]); // Si la extensión no es ".md", devuelve una promesa resuelta con un array vacío
  } catch (error) {
    console.log("Error:", error); // Si se produce un error, muestra el mensaje de error en la consola
    return Promise.resolve([]); // Devuelve una promesa resuelta con un array vacío
  }
}

const filePath = "./README.md";
const fileStatus = isFileOrDirectory(filePath);

if (fileStatus === "Archivo") {
  if (isMarkdownFile(filePath)) { // Llama a la función isMarkdownFile para verificar si es un archivo Markdown
    console.log("El archivo es un archivo .md");
    isMarkdownFile(filePath)
      .then((links) => { // Si la promesa se resuelve correctamente, obtiene el resultado de los enlaces
        console.log("Enlaces encontrados:");
        links.forEach((link) => { // Itera sobre los enlaces y muestra el texto y la URL
          console.log(`Texto: ${link.text}, URL: ${link.url}`);
        });
      })
      .catch((error) => {
        console.log("Error:", error); // Si la promesa es rechazada, muestra el mensaje de error en la consola
      });
  } else {
    console.log("El archivo no es un archivo .md");
    console.log([]); // Devolver un array vacío
  }
} else {
  console.log("La ruta no corresponde a un archivo");
}

module.exports = {
  isAbsoluteR,
  isRelative,
  isValid,
  isFileOrDirectory,
  isMarkdownFile,
};
