import mongoose from "mongoose";
import PetsDAO from "../dao/pets.dao.js";
import PetsRepository from "../repository/pets.repository.js";

const petsDAO = new PetsDAO();
const petsRepository = new PetsRepository(petsDAO);

class PetsService {
  async getAll() {
    return await petsRepository.getAll();
  }

  async getById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID inválido");
    }

    const pet = await petsRepository.getById(id);
    if (!pet) {
      throw new Error("Mascota no encontrada");
    }

    return pet;
  }

  async create(petData) {
    return await petsRepository.create(petData);
  }

  async update(id, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID inválido");
    }

    const updatedPet = await petsRepository.update(id, updateData);
    if (!updatedPet) {
      throw new Error("Mascota no encontrada para actualizar");
    }
    return updatedPet;
  }

  async delete(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID inválido");
    }

    const deletedPet = await petsRepository.delete(id);
    if (!deletedPet) {
      throw new Error("Mascota no encontrada para eliminar");
    }
    return deletedPet;
  }
}

export default new PetsService();
