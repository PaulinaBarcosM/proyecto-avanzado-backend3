import Users from "../dao/users.dao.js";
import Pets from "../dao/pets.dao.js";
import Adoption from "../dao/adoption.dao.js";

import UsersRepository from "../repository/users.repository.js";
import PetsRepository from "../repository/pets.repository.js";
import AdoptionRepository from "../repository/adoption.repository.js";

export const usersService = new UsersRepository(new Users());
export const petsService = new PetsRepository(new Pets());
export const adoptionsService = new AdoptionRepository(new Adoption());

import petsService from "./pets.service.js";

export { petsService };
