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
    this.timeout(5000);
    await mongoose.connection.collection("users").deleteMany({});

    const register = await requester
      .post("/api/sessions/register")
      .send(baseUser);
    //console.log("REGISTER RESPONSE:", register.status, register.body);
    expect(register.status).to.be.oneOf([200, 201]);

    const login = await requester.post("/api/sessions/login").send({
      email: baseUser.email,
      password: baseUser.password,
    });
    //console.log("LOGIN RESPONSE:", login.body);
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
});
