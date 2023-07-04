const { mdLinks } = require("../mdLinks.js");
const pathUser = "./mock-directory/mockREADME2.md";

describe("mdLinks", () => {
  it("Deberia retornar una promesa que se resuelve con un array de objetos", (done) => {
    const result = mdLinks(pathUser, options = { validate: true });
    expect(result)
      .resolves.toEqual([
        {
          href: 'https://nodejs.org/es/about/',
          text: 'Acerca de Node.js - Documentación oficial',
          file: 'C:\\Users\\USER\\Desktop\\Proyecto4\\DEV006-md-links\\mock-directory\\mockREADME2.md',
          status: 200,
          statusText: 'OK'
        }
      ]).then(done);
  });
});
