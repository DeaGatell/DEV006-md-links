const path = require("path");
const fs = require("fs");

// Determina si la ruta es absoluta
function isAbsoluteR(route) {
  try {
    const convertedRoute = path.normalize(route);
    return path.isAbsolute(convertedRoute);
  } catch (error) {
    console.log("Error: ", error);
  }
}

// Convierte la ruta en una ruta absoluta
function isRelative(route) {
  try {
    return path.resolve(route);
  } catch (error) {
    console.log("Error: ", error);
  }
}

// Verifica si la ruta es válida (existe un archivo o directorio)
function isValid(route) {
  try {
    const isAbsolute = isAbsoluteR(route);
    const isRel = isRelative(route);
    const resolvedRoute = isAbsolute ? route : isRel;
    fs.accessSync(resolvedRoute); // Verificar la existencia del archivo o directorio
    return true;
  } catch (error) {
    console.log("Error:", error);
    return false;
  }
}

// Verifica si la ruta corresponde a un archivo o directorio
function isFileOrDirectory(route) {
  try {
    const resolvedRoute = path.resolve(route);
    const stats = fs.statSync(resolvedRoute);

    if (stats.isFile()) {
      return "Archivo";
    } else if (stats.isDirectory()) {
      return "Directorio";
    } else {
      return "Desconocido";
    }
  } catch (error) {
    console.log("Error:", error);
    return "Error";
  }
}

// Verifica si el archivo es un archivo Markdown y extrae los enlaces
function isMarkdownFile(route) {
  try {
    const extname = path.extname(route);
    if (extname === ".md") {
      return new Promise((resolve, reject) => {
        fs.readFile(route, "utf8", (error, content) => {
          if (error) {
            console.log("Error:", error);
            reject(error);
          } else {
            const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
            const links = [];
            let match;
            while ((match = linkRegex.exec(content))) {
              const [, text, url] = match;
              links.push({ text, url });
            }
            resolve(links);
          }
        });
      });
    }
    return Promise.resolve([]);
  } catch (error) {
    console.log("Error:", error);
    return Promise.resolve([]);
  }
}

const filePath = "./README.md";
const fileStatus = isFileOrDirectory(filePath);

if (fileStatus === "Archivo") {
  if (isMarkdownFile(filePath)) {
    console.log("El archivo es un archivo .md");
    isMarkdownFile(filePath)
      .then((links) => {
        console.log("Enlaces encontrados:");
        links.forEach((link) => {
          console.log(`Texto: ${link.text}, URL: ${link.url}`);
        });
      })
      .catch((error) => {
        console.log("Error:", error);
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
