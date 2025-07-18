import mongoose from "mongoose";

import AdoptionService from "../services/adoption.service.js";
import PetsService from "../services/pets.service.js";
import UsersService from "../services/users.service.js";
import AdoptionRepository from "../repository/adoption.repository.js";
import PetsRepository from "../repository/pets.repository.js";
import UsersRepository from "../repository/users.repository.js";
import PetsDAO from "../dao/pets.dao.js";
import UsersDAO from "../dao/users.dao.js";
import AdoptionDAO from "../dao/adoption.dao.js";

const adoptionService = new AdoptionService(
  new AdoptionRepository(new AdoptionDAO())
);
const petsService = new PetsService(new PetsRepository(new PetsDAO()));
const usersService = new UsersService(new UsersRepository(new UsersDAO()));

const getAllAdoptions = async (req, res) => {
  try {
    const result = await adoptionService.getAllAdoptions();
    req.logger.info("Se obtuvieron todas las adopciones");
    res.send({ status: "success", payload: result });
  } catch (error) {
    req.logger.error(`Error al obtener adopciones: ${error.message}`);
    res
      .status(500)
      .send({ status: "error", error: "Error interno del servidor" });
  }
};

const getAdoption = async (req, res) => {
  try {
    const adoptionId = req.params.aid;

    if (!mongoose.Types.ObjectId.isValid(adoptionId)) {
      req.logger.warn(`ID de adopción inválido: ${adoptionId}`);
      return res.status(400).send({ status: "error", error: "ID inválido" });
    }

    const adoption = await adoptionService.getAdoptionById(adoptionId);
    if (!adoption) {
      req.logger.warn(`Adopción no encontrada: ID ${adoptionId}`);
      return res
        .status(404)
        .send({ status: "error", error: "Adoption not found" });
    }

    req.logger.info(`Adopción obtenida: ID ${adoptionId}`);
    res.send({ status: "success", payload: adoption });
  } catch (error) {
    req.logger.error(
      `Error al obtener adopción ${req.params.aid}: ${error.message}`
    );
    res
      .status(500)
      .send({ status: "error", error: "Error interno del servidor" });
  }
};

const createAdoption = async (req, res) => {
  try {
    const { uid, pid } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(uid) ||
      !mongoose.Types.ObjectId.isValid(pid)
    ) {
      req.logger.warn(
        `ID de usuario o mascota inválido. UID: ${uid} | PID: ${pid}`
      );
      return res.status(400).send({ status: "error", error: "ID inválido" });
    }

    const user = await usersService.getUserRawById(uid);
    if (!user) {
      req.logger.warn(`Usuario no encontrado: ID ${uid}`);
      return res.status(404).send({ status: "error", error: "User not found" });
    }

    const pet = await petsService.getById(pid);
    if (!pet) {
      req.logger.warn(`Mascota no encontrada: ID ${pid}`);
      return res.status(404).send({ status: "error", error: "Pet not found" });
    }

    if (!user.pets) user.pets = [];
    if (!user.pets.includes(pet._id)) user.pets.push(pet._id);

    await usersService.updateUser(user._id, { pets: user.pets });

    await petsService.update(pet._id, { adopted: true, owner: user._id });

    const adoption = await adoptionService.create({
      owner: user._id,
      pet: pet._id,
    });

    req.logger.info(`Mascota adoptada: Pet ${pet._id} por User ${user._id}`);
    res.send({ status: "success", message: "Pet adopted", payload: adoption });
  } catch (error) {
    console.log("❌ Error en crear adopción:", error.message);

    req.logger.error(`Error al crear adopción: ${error.message}`);
    res
      .status(500)
      .send({ status: "error", error: "Error interno del servidor" });
  }
};

export default {
  createAdoption,
  getAllAdoptions,
  getAdoption,
};
