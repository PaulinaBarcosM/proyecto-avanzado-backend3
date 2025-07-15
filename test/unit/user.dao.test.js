import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import UsersDAO from "../../src/dao/users.dao.js";
import Assert from "assert";
import chai from "chai";
import { baseUser } from "../mocks/mock.user.test.js";

const assert = Assert.strict;
const expect = chai.expect;

describe("Testing Users DAO con CHAI", function () {
  before(async function () {
    await mongoose.connect(process.env.MONGO_URL);

    this.userDao = new UsersDAO();
    this.mockUser = baseUser;
  });

  after(async function () {
    await mongoose.connection.close();
  });

  beforeEach(async function () {
    this.timeout(5000);
    await mongoose.connection.collection("users").deleteMany({});
  });
  it("El get debe devolver un arreglo", async function () {
    console.log(this.userDao);
    const result = await this.userDao.get();
    expect(result).to.be.an("array");

    console.log("Usuarios en DB:", result);
  });

  it("El DAO debe guardar un usuario correctamente en la base de datos", async function () {
    const result = await this.userDao.save(this.mockUser);
    expect(result).to.have.property("_id");
  });

  it("El DAO debe econtrar a un usuario por email", async function () {
    const result = await this.userDao.save(this.mockUser);
    const user = await this.userDao.getBy({ email: this.mockUser.email });

    expect(user).to.be.an("object");
    expect(user)
      .to.have.property("first_name")
      .that.equals(this.mockUser.first_name);
    expect(user)
      .to.have.property("last_name")
      .that.equals(this.mockUser.last_name);
  });

  it("El DAO debe actualizar correctamente un usuario", async function () {
    const savedUser = await this.userDao.save(this.mockUser);
    expect(savedUser).to.have.property("_id");

    await new Promise((resolve) => setTimeout(resolve, 100));

    const updatedData = { first_name: "Paulina" };
    const updatedUser = await this.userDao.update(savedUser._id, updatedData);

    expect(updatedUser).to.not.be.null;
    expect(updatedUser).to.have.property("first_name").that.equals("Paulina");
  });

  it("El DAO debe eliminar un usuario correctamente", async function () {
    const savedUser = await this.userDao.save(this.mockUser);

    const deletedUser = await this.userDao.delete(savedUser._id);
    const foundUser = await this.userDao.getBy({ _id: savedUser._id });

    expect(deletedUser).to.have.property("_id").that.eql(savedUser._id);
    expect(foundUser).to.be.null;
  });

  it("El DAO debe devolver null si no encuentra un usuario", async function () {
    const result = await this.userDao.getBy({ email: "noexiste@email.com" });
    expect(result).to.be.null;
  });
});
