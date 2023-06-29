const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");

// Obtener la ruta del usuario desde los argumentos de la línea de comandos
const pathUser = process.argv[2];

// Confirmar si la ruta existe
const pathExists = (pathUser) => {
  if (fs.existsSync(pathUser)) {
    return true;
  } else {
    return false;
  }
};

// Verificar si la ruta es absoluta, si es relativa convertirla a absoluta
const convertToAbsolutePath = (pathUser) => {
  if (path.isAbsolute(pathUser)) {
    return pathUser;
  } else {
    return path.resolve(process.cwd(), pathUser);
  }
};

// Leer el directorio y retornar array de archivos .md
const readDir = (pathUser) => {
  const mdFiles = [];
  const stats = fs.statSync(pathUser);

  if (stats.isFile() && path.extname(file) === ".md") {
    // Si la ruta es un archivo y tiene extensión .md, se agrega al array mdFiles
    return [pathUser];
  }

  const files = fs.readdirSync(pathUser);
  files.forEach((file) => {
    const absoluteFilePath = path.join(pathUser, file);
    const stats = fs.statSync(absoluteFilePath);

    if (stats.isDirectory()) {
      // Si la ruta es un directorio, se realiza una llamada recursiva a readDir para buscar archivos .md dentro de este
      mdFiles.push(...readDir(absoluteFilePath));
    } else {
      if (path.extname(file) === ".md") {
        // Si la ruta es un archivo con extensión .md, se agrega al array mdFiles
        mdFiles.push(absoluteFilePath);
      }
    }
  });

  return mdFiles;
};

// Leer archivos .md
const readFileMd = (pathUser) => {
  return new Promise((resolve, reject) => {
    let links = [];

    fs.readFile(pathUser, "utf8", (err, data) => {
      if (err) {
        reject(err, "No se puede leer el archivo");
      } else {
        const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;

        while ((match = regex.exec(data))) {
          const text = match[1];
          const url = match[2];

          links.push({ href: url, text, file: pathUser });
        }

        resolve(links);
      }
    });
  });
};

// Validar si es una URL
const validateUrl = (links) => {
  return new Promise((resolve, reject) => {
    fetch(links.href)
      .then((response) => {
        const status = response.status;
        const statusText = status >= 200 && status < 399 ? "OK" : "Fail";
        resolve({ status, statusText });
      })
      .catch((error) => {
        const status = 404; // Not Found
        const statusText = "Fail";
        reject({ status, statusText, error });
      });
  });
};

// Validar si la URL es correcta o no el status
const validateURLs = (urls, filePath) => {
  const urlPromises = urls.map((urlInfo) => {
    return validateUrl(urlInfo)
      .then(({ status }) => {
        return {
          href: urlInfo.href,
          text: urlInfo.text,
          file: filePath,
          status: status,
          statusText: status >= 200 && status < 399 ? "OK" : "Fail",
        };
      })
      .catch((error) => {
        return {
          href: urlInfo.href,
          text: urlInfo.text,
          file: filePath,
          status: error.status,
          statusText: error.statusText,
        };
      });
  });

  return Promise.all(urlPromises);
};

// Obtener los links de archivos .md que no estén repetidos
const uniqueLinks = (links) => {
  const uniqueLinks = [];

  links.forEach((link) => {
    const linkExists = uniqueLinks.find((uniqueLink) => {
      return uniqueLink.href === link.href;
    });

    if (!linkExists) {
      uniqueLinks.push(link);
    }
  });

  return uniqueLinks;
};

// Obtener los links de archivos .md que estén rotos
const brokenLinks = (links) => {
  const brokenLinks = [];

  links.forEach((link) => {
    if (link.statusText === "Fail") {
      brokenLinks.push(link);
    }
  });

  return brokenLinks;
};

module.exports = {
  pathExists,
  convertToAbsolutePath,
  readDir,
  readFileMd,
  validateUrl,
  validateURLs,
  uniqueLinks,
  brokenLinks,
};