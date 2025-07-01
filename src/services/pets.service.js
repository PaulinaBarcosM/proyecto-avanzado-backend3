import mongoose from "mongoose";

class PetsService {
  constructor(repository) {
    this.repository = repository;
  }

  async getAll() {
    return await this.repository.getAll();
  }

  async getById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID inválido");
    }

    const pet = await this.repository.getById(id);
    if (!pet) {
      throw new Error("Mascota no encontrada");
    }
    return pet;
  }

  async create(petData) {
    return await this.repository.create(petData);
  }

  async update(id, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID inválido");
    }

    const updatedPet = await this.repository.update(id, updateData);
    if (!updatedPet) {
      throw new Error("Mascota no encontrada para actualizar");
    }
    return updatedPet;
  }

  async delete(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID inválido");
    }

    const deletedPet = await this.repository.delete(id);
    if (!deletedPet) {
      throw new Error("Mascota no encontrada para eliminar");
    }
    return deletedPet;
  }
}

export default PetsService;
