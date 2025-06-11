import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

const hashPassword = (password) => bcrypt.hashSync(password, 10);

export const generateUser = () => {
  let pets = [];

  return {
    id: faker.database.mongodbObjectId(),
    name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    password: hashPassword("coder123"),
    role: faker.helpers.arrayElement(["user", "admin"]),
    pets,
  };
};
