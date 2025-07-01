import PetsDTO from "../dto/pets.dto.js";
import { petsService } from "../services/index.js";
import __dirname from "../utils/index.js";
import mongoose from "mongoose";

const getAllPets = async (req, res) => {
  try {
    const pets = await petsService.getAll();
    req.logger.info("Se obtuvieron todas las mascotas");
    res.send({ status: "success", payload: pets });
  } catch (error) {
    req.logger.error(`Error al obtener mascotas: ${error.message}`);
    res
      .status(500)
      .send({ status: "error", error: "Error interno del servidor" });
  }
};

const createPet = async (req, res) => {
  try {
    const { name, specie, breed, color, ageYears, ageMonths } = req.body;
    if (!name || !specie || !breed || ageYears === undefined) {
      req.logger.warn("Faltan campos obligatorios para crear una mascota");
      return res
        .status(400)
        .send({ status: "error", error: "Incomplete values" });
    }

    const pet = PetsDTO.getPetInputFrom({
      name,
      specie,
      breed,
      color,
      ageYears,
      ageMonths,
    });
    const result = await petsService.create(pet);
    req.logger.info(`Mascota creada: ${name}`);
    res.send({ status: "success", payload: result });
  } catch (error) {
    req.logger.error(`Error al crear mascota: ${error.message}`);
    res
      .status(500)
      .send({ status: "error", error: "Error interno del servidor" });
  }
};

const updatePet = async (req, res) => {
  try {
    const petId = req.params.pid;
    const petUpdateBody = req.body;

    if (!mongoose.Types.ObjectId.isValid(petId)) {
      req.logger.warn(`ID inválido para actualización: ${petId}`);
      return res.status(400).send({ status: "error", error: "ID inválido" });
    }

    const result = await petsService.update(petId, petUpdateBody);
    req.logger.info(`Mascota actualizada: ID ${petId}`);
    res.send({ status: "success", message: "pet updated" });
  } catch (error) {
    req.logger.error(
      `Error al actualizar mascota ${req.params.pid}: ${error.message}`
    );
    res
      .status(500)
      .send({ status: "error", error: "Error interno del servidor" });
  }
};

const deletePet = async (req, res) => {
  try {
    const petId = req.params.pid;

    if (!mongoose.Types.ObjectId.isValid(petId)) {
      req.logger.warn(`ID inválido para eliminación: ${petId}`);
      return res.status(400).send({ status: "error", error: "ID inválido" });
    }

    const result = await petsService.delete(petId);
    req.logger.info(`Mascota eliminada: ID ${petId}`);
    res.send({ status: "success", message: "Pet deleted" });
  } catch (error) {
    req.logger.error(
      `Error al eliminar mascota ${req.params.pid}: ${error.message}`
    );
    res
      .status(500)
      .send({ status: "error", error: "Error interno del servidor" });
  }
};

const createPetWithImage = async (req, res) => {
  try {
    const file = req.file;
    const { name, specie, breed, color, ageYears, ageMonths } = req.body;

    if (!name || !specie || !breed || ageYears === undefined || !file) {
      req.logger.warn("Faltan datos o imagen para crear mascota con imagen");
      return res
        .status(400)
        .send({ status: "error", error: "Incomplete values" });
    }

    const pet = PetsDTO.getPetInputFrom({
      name,
      specie,
      breed,
      color,
      ageYears,
      ageMonths,
      image: `${__dirname}/../public/img/${file.filename}`,
    });

    const result = await petsService.create(pet);
    req.logger.info(`Mascota con imagenes creada: ${name}`);
    res.send({ status: "success", payload: result });
  } catch (error) {
    req.logger.error(`Error al crear mascota con imagen: ${error.message}`);
    res
      .status(500)
      .send({ status: "error", error: "Error interno del servidor" });
  }
};

export default {
  getAllPets,
  createPet,
  updatePet,
  deletePet,
  createPetWithImage,
};
