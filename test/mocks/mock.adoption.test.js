import mongoose from "mongoose";
import { baseUser } from "./mock.user.test.js";

export const mockPetId = new mongoose.Types.ObjectId();
export const mockInvalidId = "123abc";

export const mockPet = {
  _id: mockPetId,
  name: "Firulais",
  specie: "dog",
  breed: "Labrador",
  age: { years: 2, months: 3 },
  adopted: false,
};

export const mockAdoption = {
  pet: mockPetId,
  owner: baseUser,
};

export const mockAdoptionInDB = {
  _id: new mongoose.Types.ObjectId(),
  pet: mockPetId,
  owner: baseUser,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockUpdatedAdoption = {
  reason: "Cambio de dueño",
};
