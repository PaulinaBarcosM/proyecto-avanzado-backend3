import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import supertest from "supertest";
import chai from "chai";
import { baseUser } from "../mocks/mock.user.test.js";
import UserModel from "../../src/models/users.model.js";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

mongoose.connect(process.env.MONGO_URL);

describe("Testing funcional Users", function () {
  let token;
  let userId;

  beforeEach(async function () {
    this.timeout(10000);
    console.log("Antes de borrar usuarios");
    await mongoose.connection.collection("users").deleteMany({});
    console.log("Usuarios borrados");

    const register = await requester
      .post("/api/sessions/register")
      .send(baseUser);
    console.log("Registro hecho, status:", register.status);
    expect(register.status).to.be.oneOf([200, 201]);

    const login = await requester
      .post("/api/sessions/login")
      .send({ email: baseUser.email, password: baseUser.password });
    console.log("Login hecho, status:", login.status);
    expect(login.status).to.equal(200);

    token = login.body.data.token;
    userId = login.body.data.user._id;
    console.log("Token y userId guardados");
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
});
