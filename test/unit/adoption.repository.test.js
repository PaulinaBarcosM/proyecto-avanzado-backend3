import mongoose, { mongo } from "mongoose";
import chai from "chai";
import AdoptionRepository from "../../src/repository/adoption.repository.js";
import AdoptionDAO from "../../src/dao/adoption.dao.js";
import PetModel from "../../src/models/pets.model.js";
import UserModel from "../../src/models/users.model.js";
import {
  mockPet,
  mockAdoption,
  mockUpdatedAdoption,
} from "../mocks/mock.adoption.test.js";
import { baseUser } from "../mocks/mock.user.test.js";

const expect = chai.expect;
mongoose.connect(process.env.MONGO_URL);

describe("Testing Adoption Repository", function () {
  const dao = new AdoptionDAO();
  const repo = new AdoptionRepository(dao);

  beforeEach(async function () {
    this.timeout(5000);
    await mongoose.connection.collections.adoptions?.deleteMany({});
    await mongoose.connection.collections.users?.deleteMany({});
    await mongoose.connection.collections.pets?.deleteMany({});
  });

  it("Debe obtener todas las adopciones", async function () {
    const pet = await PetModel.create(mockPet);
    const user = await UserModel.create(baseUser);
    await repo.create({ pet: pet._id, owner: user._id });

    const result = await repo.getAll();
    expect(result).to.be.an("array");
    expect(result.length).to.be.greaterThan(0);
  });

  it("Debe obtener una adopción por ID", async function () {
    const pet = await PetModel.create(mockPet);
    const user = await UserModel.create(baseUser);
    const created = await repo.create({ pet: pet._id, owner: user._id });

    const result = await repo.getById(created._id);
    expect(result).to.have.property("_id");
    expect(result.pet._id.toString()).to.equal(pet._id.toString());
  });
});
