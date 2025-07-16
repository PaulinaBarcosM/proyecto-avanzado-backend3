import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import PetsDAO from "../../src/dao/pets.dao.js";
import Assert from "assert";
import chai from "chai";
import { mockPetTwo, mockPetUpdate } from "../mocks/mock.adoption.test.js";

const assert = Assert.strict;
const expect = chai.expect;

describe("Testing Pets DAO", function () {
  const mockPet = mockPetTwo;
  before(async function () {
    await mongoose.connect(process.env.MONGO_URL);
    this.petsDAO = new PetsDAO();
    this.mockPet = mockPet;
  });

  after(async function () {
    await mongoose.connection.close();
  });

  beforeEach(async function () {
    await mongoose.connection.collection("pets").deleteMany({});
  });

  it("El get debe devoler un arreglo", async function () {
    const result = await this.petsDAO.get({});
    expect(result).to.be.an("array");
  });

  it("El DAO debe guardar una mascota correctamente", async function () {
    const result = await this.petsDAO.save(this.mockPet);
    expect(result).to.have.property("_id");
  });

  it("El DAO debe encontrar una mascota por nombre", async function () {
    const savedPet = await this.petsDAO.save(this.mockPet);
    const pet = await this.petsDAO.getBy({ name: this.mockPet.name });
    expect(pet).to.be.an("object");
    expect(pet).to.have.property("name").that.equals(this.mockPet.name);
  });

  it("El DAO debe actualizar correctamente una mascota", async function () {
    const savedPet = await this.petsDAO.save(this.mockPet);
    const updatedPet = await this.petsDAO.update(savedPet._id, mockPetUpdate);

    expect(updatedPet).to.have.property("name").that.equals(mockPetUpdate.name);
  });

  it("El DAO debe eliminar correctamente una mascota", async function () {
    const savedPet = await this.petsDAO.save(this.mockPet);
    const deletedPet = await this.petsDAO.delete(savedPet._id);
    const foundPet = await this.petsDAO.getBy({ _id: savedPet._id });

    expect(deletedPet._id.toString()).to.eql(savedPet._id.toString());
    expect(foundPet).to.be.null;
  });

  it("El DAO debe devolver null si no encuentra una mascota", async function () {
    const result = await this.petsDAO.getBy({ name: "NoExiste" });
    expect(result).to.be.null;
  });
});
