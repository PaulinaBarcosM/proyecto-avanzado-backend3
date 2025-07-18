import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import supertest from "supertest";
import chai from "chai";
import { mockPetRequest, mockPetUpdate } from "../mocks/mock.adoption.test.js";
import PetModel from "../../src/models/pets.model.js";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Testing funcional Pets", function () {
  const mockPet = mockPetRequest;
  let petId;

  before(async function () {
    this.timeout(10000);
    await mongoose.connect(process.env.MONGO_URL);
  });

  beforeEach(async function () {
    await mongoose.connection.collection("pets").deleteMany({});

    const res = await requester.post("/api/pets").send(mockPet);
    expect(res.status).to.equal(200);
    petId = res.body.payload._id;
  });

  after(async function () {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it("GET /api/pets debe obtener todas las mascotas correctamente", async function () {
    const res = await requester.get("/api/pets");
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.payload).to.be.an("array");
    expect(res.body.payload.length).to.be.greaterThan(0);
  });

  it("POST /api/pets debe crear una mascota correctamente", async function () {
    const res = await requester.post("/api/pets").send(mockPet);

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.payload).to.have.property("_id");
    expect(res.body.payload.name).to.equal(mockPet.name);
  });

  it("PUT /api/pets/:pid debe actualizar una mascota correctamente", async function () {
    const res = await requester.put(`/api/pets/${petId}`).send(mockPetUpdate);
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("success");

    const resGet = await requester.get("/api/pets");
    const pet = resGet.body.payload.find((p) => p._id === petId);
    expect(pet.name).to.equal(mockPetUpdate.name);
  });

  it("DELETE /api/pets/:pid debe eliminar una mascota correctamente", async function () {
    const res = await requester.delete(`/api/pets/${petId}`);
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("success");

    const resGet = await requester.get("/api/pets");
    const pet = resGet.body.payload.find((p) => p._id === petId);
    expect(pet).to.be.undefined;
  });

  it("GET /api/pets debe devolver un array vacío si no hay mascotas", async function () {
    await mongoose.connection.collection("pets").deleteMany({});
    const res = await requester.get("/api/pets");
    expect(res.status).to.equal(200);
    expect(res.body.payload).to.be.an("array").that.is.empty;
  });

  it("PUT /api/pets/:pid debe devolver 400 si el ID es inválido", async function () {
    const invalidId = "123";
    const res = await requester
      .put(`/api/pets/${invalidId}`)
      .send(mockPetUpdate);

    expect(res.status).to.equal(400);
    expect(res.body.status).to.equal("error");
    expect(res.body.error).to.match(/inválido/i);
  });

  it("DELETE /api/pets/:pid debe devolver error si la mascota no existe", async function () {
    const nonExistentId = "64c3e1e4ed84999999999999";
    const res = await requester.delete(`/api/pets/${nonExistentId}`);

    expect(res.status).to.be.oneOf([400, 500]);
    expect(res.body.status).to.equal("error");
  });
});
