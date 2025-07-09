import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import chai from "chai";
import assert from "assert";
import AdoptionDAO from "../../src/dao/adoption.dao.js";
import UsersDAO from "../../src/dao/users.dao.js";
import PetsDAO from "../../src/dao/pets.dao.js";

const expect = chai.expect;
const strict = assert.strict;

mongoose.connect(process.env.MONGO_URL);

describe("Testing Adoption DAO", function () {
  before(async function () {
    this.adoptionDao = new AdoptionDAO();
    this.userDao = new UsersDAO();
    this.petsDao = new PetsDAO();

    this.mockUser = await this.userDao.save({
      first_name: "Paula",
      last_name: "Barcos",
      email: "paula@correo.com",
      password: "123456",
    });

    this.mockPet = await this.petsDao.save({
      name: "Luna",
      specie: "dog",
      breed: "Beagle",
      age: { years: 2, months: 3 },
    });

    this.mockAdoption = {
      owner: this.mockUser._id,
      pet: this.mockPet._id,
    };
  });

  beforeEach(async function () {
    await mongoose.connection.collections.adoptions.drop().catch(() => {});
    this.timeout(5000);
  });

  it("El método get debe devolver un arreglo", async function () {
    const result = await this.adoptionDao.get();
    expect(result).to.be.an("array");
  });

  it("Debe guardar una adopción correctamente", async function () {
    const result = await this.adoptionDao.save(this.mockAdoption);
    expect(result).to.have.property("_id");
    this.adoptionId = result._id;
  });

  it("Debe obtener una adopción por ID de la mascota", async function () {
    const saved = await this.adoptionDao.save(this.mockAdoption);
    const found = await this.adoptionDao.getBy({ pet: this.mockPet._id });
    expect(found).to.have.property("owner");
    expect(found.owner._id.toString()).to.equal(this.mockUser._id.toString());

    //console.log(found);
  });

  it("Debe actualizar una adopción correctamente", async function () {
    const saved = await this.adoptionDao.save(this.mockAdoption);
    const newPet = await this.petsDao.save({
      name: "Mishi",
      specie: "Cat",
      breed: "Siamés",
      age: { years: 1, months: 5 },
    });

    const updated = await this.adoptionDao.update(saved._id, {
      pet: newPet._id,
    });

    expect(updated.pet._id.toString()).to.equal(newPet._id.toString());
  });

  it("Debe devolver null si no encuentra una adopción", async function () {
    const result = await this.adoptionDao.getBy({
      pet: new mongoose.Types.ObjectId(),
    });
    strict.equal(result, null);
  });
});
