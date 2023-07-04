const { mdLinks } = require('./mdLinks.js');

const pathUser = process.argv[2];

mdLinks(pathUser, { validate: true })
  .then((links) => {
    console.log(links);
  })
  .catch((error) => {
    console.error(error);
  });

  //Ruta de prueba
  //C://Users//USER//Desktop//Proyecto4//DEV006-md-links//mock-directory