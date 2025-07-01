import mongoose from "mongoose";
import PetModel from "../models/pets.model.js";

class AdoptionService {
  constructor(repository) {
    this.repository = repository;
  }

  async getAllAdoptions() {
    return await this.repository.getAll();
  }

  async getAdoptionById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID inválido");
    }
    const adoption = await this.repository.getById(id);
    if (!adoption) throw new Error("Adopción no enontrada");
    return adoption;
  }

  async createAdoption(data) {
    const { pet, owner } = data;

    //lógica para ver si la mascota esta adoptada
    if (!mongoose.Types.ObjectId.isValid(pet)) {
      throw new Error("ID de la mascota inválido");
    }
    if (!mongoose.Types.ObjectId.isValid(owner)) {
      throw new Error("ID de dueño inválido");
    }

    const existingAdoption = await this.repository.getBy({ pet });
    if (existingAdoption) {
      throw new Error("La mascota ya fue adoptada");
    }

    const petDB = await PetModel.findById(pet);
    if (!petDB) {
      throw new Error("Mascota no encontrada");
    }

    if (petDB.adopted) {
      throw new Error("Esta mascota ya fue adoptada");
    }

    petDB.adopted = true;
    await petDB.save();

    //creamos la adopción
    const newAdoption = await this.repository.create({ pet, owner });
    return newAdoption;
  }

  async updateAdoption(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID inválido");
    }

    const updated = await this.repository.update(id, data);
    if (!updated) throw new Error("Adopción no encontrada");
    return updated;
  }

  async deleteAdoption(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID inválido");
    }

    const deleted = await this.repository.delete(id);
    if (!deleted) throw new Error("Adopción no encontrada");
    return deleted;
  }
}

export default AdoptionService;
