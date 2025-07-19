import mongoose from "mongoose";
import AdoptionService from "../services/adoption.service.js";
import AdoptionRepository from "../repository/adoption.repository.js";
import AdoptionDAO from "../dao/adoption.dao.js";

const adoptionService = new AdoptionService(
  new AdoptionRepository(new AdoptionDAO())
);

const getAllAdoptions = async (req, res) => {
  try {
    const adoptions = await adoptionService.getAllAdoptions();
    req.logger.info("Se obtuvieron todas las adopciones");
    res.send({ status: "success", payload: adoptions });
  } catch (error) {
    req.logger.error(`Error al obtener adopciones: ${error.message}`);
    return res
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
    console.error(error);
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

    const adoption = await adoptionService.createAdoption({
      owner: uid,
      pet: pid,
    });

    req.logger.info(`Mascota adoptada: Pet ${pid} por User ${uid}`);
    res.send({ status: "success", message: "Pet adopted", payload: adoption });
  } catch (error) {
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
