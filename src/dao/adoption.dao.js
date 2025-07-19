import AdoptionModel from "../models/adoption.model.js";

export default class AdoptionDAO {
  async get(params = {}) {
    return await AdoptionModel.find(params).populate("owner").populate("pet");
  }

  async getBy(params) {
    return await AdoptionModel.findOne(params);
  }

  async save(doc) {
    return await AdoptionModel.create(doc);
  }

  async update(id, doc) {
    return await AdoptionModel.findByIdAndUpdate(
      id,
      { $set: doc },
      { new: true }
    );
  }

  async delete(id) {
    return await AdoptionModel.findByIdAndDelete(id);
  }
}
