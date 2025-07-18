import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import supertest from "supertest";
import chai from "chai";
import { mockPetRequest } from "../mocks/mock.adoption.test.js";
import { baseUser } from "../mocks/mock.user.test.js";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Testing funcional Adoptions", function () {
  let token;
  let userId;
  let petId;
  let adoptionId;
  const mockUser = baseUser;
  const mockPet = mockPetRequest;

  before(async function () {
    this.timeout(10000);
    await mongoose.connect(process.env.MONGO_URL);
  });

  beforeEach(async function () {
    this.timeout(10000);

    await mongoose.connection.collection("adoptions").deleteMany({});
    await mongoose.connection.collection("pets").deleteMany({});
    await mongoose.connection.collection("users").deleteMany({});

    const register = await requester
      .post("/api/sessions/register")
      .send(mockUser);
    expect(register.status).to.be.oneOf([200, 201]);

    const login = await requester
      .post("/api/sessions/login")
      .send({ email: mockUser.email, password: mockUser.password });
    expect(login.status).to.equal(200);

    token = login.body.data.token;
    userId = login.body.data.user._id;

    console.log("Usuario registrado:", userId);
    console.log("Token generado:", token);

    const petRes = await requester.post("/api/pets").send(mockPet);
    expect(petRes.status).to.equal(200);
    petId = petRes.body.payload._id;
  });

  after(async function () {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it("GET /api/adoptions debe devolver un array vacío si no hay adopciones", async function () {
    const res = await requester.get("/api/adoptions");
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.payload).to.be.an("array").that.is.empty;
  });

  it("POST /api/adoptions/:uid/:pid debe crear una adopción correctamente", async function () {
    const res = await requester
      .post(`/api/adoptions/${userId}/${petId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.message).to.equal("Pet adopted");

    const adoptions = await requester.get("/api/adoptions");
    adoptionId = adoptions.body.payload[0]._id;
  });
});
