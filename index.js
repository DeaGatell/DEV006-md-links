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

//Leer el directorio y retornar array de archivos .md
const readDir = (pathUser) => {
  const mdFiles = [];
  const stats = fs.statSync(pathUser);
  if(stats.isFile() && path.extname(file) === ".md"){
    return [pathUser];
  }

  const files = fs.readdirSync(pathUser);
  files.forEach((file) => {
    const absoluteFilePath = path.join(pathUser, file);
   const stats = fs.statSync(absoluteFilePath);
    if (stats.isDirectory()) {
      mdFiles.push(...readDir(absoluteFilePath));
    } else {
      if (path.extname(file) === ".md") {
        mdFiles.push(absoluteFilePath);
      }
    }
    
  });
//  console.log(mdFiles);
  return mdFiles;
};



//leer archivos .md
const readFileMd = (pathUser) => {
  return new Promise((resolve, reject) => {
    let links = [];
    fs.readFile(pathUser, "utf8", (err, data) => {
      if (err) {
        reject(err, "No se puede leer el archivo");
      } else {
        const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;
        while ((match = regex.exec(data))){
          const text = match[1];
          const url = match[2];
          links.push({ href: url, text, file: pathUser });
        }
        }
        
        resolve(links);
      });
    });
  };