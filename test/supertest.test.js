//acá vamos a hacer las pruebas funcionales ->
//vamos a interactuar con los endpoints de nuestro servidor --< pegarle a un endpoint.
import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080"); //acá lo que le decimos es que nuestros test van a enviar solicitudes a este servidor.

describe("Testing de integración Adoptme", () => {
  describe("Test de mascotas", () => {
    it("El endpoint POST /api/pets debe crear una mascota correctamente", async () => {
      const petMock = {
        name: "Patitas",
        specie: "Pez",
        birthDate: "10-10-2022",
      };
      const { statusCode, ok, _body } = await requester
        .post("/api/pets")
        .send(petMock);

      console.log(statusCode);
      console.log(ok);
      console.log(_body);
    });
  });
});
