import PetModel from "../models/Pets.js";
import UserModel from "../models/User.js";
import { generatePets } from "../utils/generatePets.js";
import { generateUser } from "../utils/generateUser.js";

export const generateFakeUsersAndPets = async (userCount, petCount) => {
  const insertedUsers = [];
  const insertedPets = [];

  //Insertar usuarios
  for (let i = 0; i < userCount; i++) {
    const fakeUser = generateUser();
    const newUser = await UserModel.create(fakeUser);
    insertedUsers.push(newUser);
  }

  //Insertar mascotas con dueño
  for (let i = 0; i < petCount; i++) {
    const fakePet = generatePets();

    //Elegir el dueño al azar entre los usuarios generados
    const randomUser =
      insertedUsers[Math.floor(Math.random() * insertedUsers.length)];

    //Asignar el ID del dueño
    fakePet.owner = randomUser._id;

    //guardar la mascota
    const newPet = await PetModel.create(fakePet);
    insertedPets.push(newPet);
  }

  return {
    users: insertedUsers,
    pets: insertedPets,
  };
};
