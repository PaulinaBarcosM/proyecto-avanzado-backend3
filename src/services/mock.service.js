import PetModel from "../models/pets.model.js";
import UserModel from "../models/users.model.js";
import { generatePets } from "../utils/generatePets.js";
import { generateUser } from "../utils/generateUser.js";
import logger from "../utils/logger.js";

export const generateFakeUsersAndPets = async (userCount, petCount) => {
  const insertedUsers = [];
  const insertedPets = [];

  try {
    //Insertar usuarios
    for (let i = 0; i < userCount; i++) {
      const fakeUser = generateUser();
      const newUser = await UserModel.create(fakeUser);
      insertedUsers.push(newUser);
    }

    logger.info(`Se generaron ${insertedUsers.length} usuarios falsos`);

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

    logger.info(`Se generaron ${insertedPets.length} mascotas falsas`);

    return {
      users: insertedUsers,
      pets: insertedPets,
    };
  } catch (error) {
    logger.error(
      `Error al generar usuarios y mascotas falsas: ${error.message}`
    );
    throw error;
  }
};
