const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch").default;
pathUser = process.argv[2]; // Obtener la ruta del usuario desde los argumentos de la línea de comandos

// Función que verifica si una ruta de archivo o directorio existe
const pathExists = (pathUser) => {
  // Verificar si la ruta especificada por pathUser existe en el sistema de archivos
  if (fs.existsSync(pathUser)) {
    return true; // Si la ruta existe, retornar true
  } else {
    return false; // Si la ruta no existe, retornar false
  }
};

// Función que verifica si la ruta es absoluta y, si es relativa, la convierte en absoluta
const convertToAbsolutePath = (pathUser) => {
  // Verificar si la ruta especificada por pathUser es absoluta
  if (path.isAbsolute(pathUser)) {
    return pathUser; // Si la ruta es absoluta, retornarla sin cambios
  } else {
    // Si la ruta es relativa, convertirla a una ruta absoluta utilizando el directorio de trabajo actual (current working directory, cwd)
    return path.resolve(process.cwd(), pathUser);
  }
};

// Leer el directorio y retornar un array de archivos .md
const readDir = (pathUser) => {
  const mdFiles = []; // Array para almacenar los archivos .md encontrados

  const stats = fs.statSync(pathUser); // Obtener información sobre la ruta especificada

  if (stats.isFile() && path.extname(file) === ".md") {
    // Si la ruta es un archivo y tiene extensión .md, se agrega al array mdFiles
    return [pathUser];
  }

  const files = fs.readdirSync(pathUser); // Obtener una lista de archivos y directorios en la ruta especificada

  files.forEach((file) => {
    const absoluteFilePath = path.join(pathUser, file); // Obtener la ruta absoluta del archivo o directorio

    const stats = fs.statSync(absoluteFilePath); // Obtener información sobre el archivo o directorio en la ruta

    if (stats.isDirectory()) {
      // Si la ruta es un directorio, se realiza una llamada recursiva a readDir para buscar archivos .md dentro de él
      mdFiles.push(...readDir(absoluteFilePath));
    } else {
      if (path.extname(file) === ".md") {
        // Si la ruta es un archivo con extensión .md, se agrega al array mdFiles
        mdFiles.push(absoluteFilePath);
      }
    }
  });

  return mdFiles; // Devolver el array de archivos .md encontrados
};

// Función que lee archivos .md
const readFileMd = (pathUser) => {
  return new Promise((resolve, reject) => {
    let links = []; // Array para almacenar los enlaces encontrados

    fs.readFile(pathUser, "utf8", (err, data) => {
      if (err) {
        reject(err, "No se puede leer el archivo"); // Si hay un error al leer el archivo, se rechaza la promesa con el error
      } else {
        const regex = /\[([^\]]+)\]\(([^)]+)\)/g; // Expresión regular para buscar enlaces en el contenido del archivo
        let match;

        while ((match = regex.exec(data))) {
          const text = match[1]; // Texto del enlace
          const url = match[2]; // URL del enlace

          links.push({ href: url, text, file: pathUser }); // Agregar el enlace al array de enlaces
        }

        resolve(links); // Resolver la promesa con el array de enlaces encontrados
      }
    });
  });
};

// Función que valida la URL
const validateUrl = (links) => {
  return new Promise((resolve, reject) => {
    fetch(links.href)
      .then((response) => {
        const status = response.status; // Estado de la respuesta HTTP

        // Determinar el estado del enlace según el código de estado de la respuesta
        const statusText = status >= 200 && status < 399 ? "OK" : "Fail";

        resolve({ status, statusText }); // Resolver la promesa con el estado del enlace
      })
      .catch((error) => {
        const status = 404; // Not Found (No encontrado)
        const statusText = "Fail";

        reject({ status, statusText, error }); // Rechazar la promesa con el estado del enlace y el error
      });
  });
};

// Función que valida el estado de múltiples URLs
const validateURLs = (urls, filePath) => {
  const urlPromises = urls.map((urlInfo) => {
    return validateUrl(urlInfo)
      .then(({ status }) => {
        // Si la validación es exitosa, se crea un objeto con la información del enlace y su estado
        return {
          href: urlInfo.href,
          text: urlInfo.text,
          file: filePath,
          status: status,
          statusText: status >= 200 && status < 399 ? "OK" : "Fail",
        };
      })
      .catch((error) => {
        // Si la validación falla, se crea un objeto con la información del enlace, su estado y el error
        return {
          href: urlInfo.href,
          text: urlInfo.text,
          file: filePath,
          status: error.status,
          statusText: error.statusText,
        };
      });
  });

  return Promise.all(urlPromises); // Devolver una promesa que se resuelve cuando todas las validaciones de URLs han finalizado
};

module.exports = {
  pathExists,
  convertToAbsolutePath,
  readDir,
  readFileMd,
  validateUrl,
  validateURLs,
};
