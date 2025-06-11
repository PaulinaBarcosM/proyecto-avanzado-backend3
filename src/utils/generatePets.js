import { faker } from "@faker-js/faker";

export const generatePets = () => {
  const totalMonths = faker.number.int({ min: 3, max: 180 });
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const age = { years, months };
  if (months === 0) {
    delete age.months;
  }

  return {
    id: faker.database.mongodbObjectId(),
    name: faker.person.firstName(),
    type: faker.animal.type(),
    breed: faker.animal.dog(),
    adopted: faker.datatype.boolean(),
    color: faker.color.human(),
    age,
  };
};
