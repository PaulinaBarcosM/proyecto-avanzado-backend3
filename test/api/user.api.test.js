import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import supertest from "supertest";
import chai from "chai";
import {
  baseUser,
  userUpdateService,
  incompleteUpdate,
} from "../mocks/mock.user.test.js";
import UserModel from "../../src/models/users.model.js";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

mongoose.connect(process.env.MONGO_URL);

describe("Testing funcional Users", function () {
  let token;
  let userId;

  beforeEach(async function () {
    this.timeout(10000);
    await mongoose.connection.collection("users").deleteMany({});

    const register = await requester
      .post("/api/sessions/register")
      .send(baseUser);
    expect(register.status).to.be.oneOf([200, 201]);

    const login = await requester
      .post("/api/sessions/login")
      .send({ email: baseUser.email, password: baseUser.password });
    expect(login.status).to.equal(200);

    token = login.body.data.token;
    userId = login.body.data.user._id;
  });

  after(async function () {
    this.timeout(5000);
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it("El endpoint GET /api/users debe obtener todos los usuarios correctamente", async function () {
    const res = await requester
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.payload).to.be.an("array");
    expect(res.body.payload.some((u) => u.email === baseUser.email)).to.be.true;
  });

  it("El endpoint GET /api/users/:uid debe obtener un usuario por su ID correctamente", async function () {
    const res = await requester
      .get(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.payload).to.have.property("email", baseUser.email);
  });

  it("El endpoint PUT /api/users/:uid debe actualizar un usuario correctamente", async function () {
    const res = await requester
      .put(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(userUpdateService);

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.message).to.equal("User updated");

    const resGet = await requester
      .get(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(resGet.body.payload).to.have.property(
      "name",
      `${userUpdateService.first_name} ${baseUser.last_name}`
    );
  });

  it("El endpoint PUT /api/users/:uid debe devolver 400 si faltan campos obligatorios", async function () {
    const res = await requester
      .put(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(incompleteUpdate);

    expect(res.status).to.equal(400);
    expect(res.body.status).to.equal("error");
    expect(res.body.error).to.match(/faltan campos obligatorios/i);
  });

  it("El endpoint DELETE /api/users/:uid debe eliminar un usuario correctamente", async function () {
    const res = await requester
      .delete(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.message).to.equal("User deleted");

    const resGet = await requester
      .get(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(resGet.status).to.equal(404);
  });

  it("Debe fallar al obtener un usuario inexistente (404)", async function () {
    const nonExistentId = "64c3e1e4ed84999999999999"; // Un ObjectId válido pero que no exista en DB
    const res = await requester
      .get(`/api/users/${nonExistentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(404);
    expect(res.body.status).to.equal("error");
    expect(res.body.error).to.match(/not found/i);
  });
});
