import PetModel from "../models/pets.model.js";

export default class PetsDAO {
  async get(params) {
    return await PetModel.find(params);
  }

  async getBy(params) {
    return await PetModel.findOne(params);
  }

  async save(doc) {
    return await PetModel.create(doc);
  }

  async update(id, doc) {
    return await PetModel.findByIdAndUpdate(id, { $set: doc }, { new: true });
  }

  async delete(id) {
    return await PetModel.findByIdAndDelete(id);
  }
}
