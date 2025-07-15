import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import chai from "chai";
const expect = chai.expect;

import AdoptionService from "../../src/services/adoption.service.js";
import AdoptionRepository from "../../src/repository/adoption.repository.js";
import AdoptionDAO from "../../src/dao/adoption.dao.js";
import PetModel from "../../src/models/pets.model.js";
import AdoptionModel from "../../src/models/adoption.model.js";
import UserModel from "../../src/models/users.model.js";
import { mockPet, mockUpdatedAdoption } from "../mocks/mock.adoption.test.js";
import { baseUser } from "../mocks/mock.user.test.js";

const service = new AdoptionService(new AdoptionRepository(new AdoptionDAO()));

describe("Testing Adoption Service", function () {
  before(async function () {
    await mongoose.connect(process.env.MONGO_URL);
  });

  after(async function () {
    await mongoose.connection.close();
  });

  beforeEach(async function () {
    this.timeout(5000);
    await mongoose.connection.collections.adoptions.drop().catch(() => {});
    await mongoose.connection.collections.pets.drop().catch(() => {});
    await mongoose.connection.collections.users.drop().catch(() => {});
  });

  it("Debe devolver un array", async function () {
    const result = await service.getAllAdoptions();
    expect(result).to.be.an("array");
  });

  it("Debe crear una adopción correctamente", async function () {
    const petCreated = await PetModel.create(mockPet);
    const userCreated = await UserModel.create(baseUser);

    const result = await service.createAdoption({
      pet: petCreated._id,
      owner: userCreated._id,
    });

    expect(result).to.have.property("_id");
    expect(result.pet.toString()).to.equal(petCreated._id.toString());
    expect(result.owner.toString()).to.equal(userCreated._id.toString());
  });

  it("Debe devolver la adopción correspondiente", async function () {
    const petCreated = await PetModel.create(mockPet);
    const userCreated = await UserModel.create(baseUser);

    const created = await service.createAdoption({
      pet: petCreated._id,
      owner: userCreated._id,
    });

    const result = await service.getAdoptionById(created._id);
    expect(result._id.toString()).to.equal(created._id.toString());
  });

  it("Debe actualizar correctamente la adopción", async function () {
    const petCreated = await PetModel.create(mockPet);
    const userCreated = await UserModel.create(baseUser);
    const created = await service.createAdoption({
      pet: petCreated._id,
      owner: userCreated._id,
    });

    const updated = await service.updateAdoption(
      created._id,
      mockUpdatedAdoption
    );
    expect(updated)
      .to.have.property("reason")
      .that.equals(mockUpdatedAdoption.reason);
  });

  it("Debe eliminar correctamente una adopción", async function () {
    const petCreated = await PetModel.create(mockPet);
    const userCreated = await UserModel.create(baseUser);
    const created = await service.createAdoption({
      pet: petCreated._id,
      owner: userCreated._id,
    });

    const deleted = await service.deleteAdoption(created._id);
    expect(deleted._id.toString()).to.equal(created._id.toString());

    const found = await AdoptionModel.findById(created._id);
    expect(found).to.be.null;
  });
});
