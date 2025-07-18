import UserModel from "../models/users.model.js";

export default class UsersDAO {
  async get(params) {
    return await UserModel.find(params);
  }

  async getBy(params) {
    return await UserModel.findOne(params);
  }

  async getUserById(id) {
    return await UserModel.findById(id);
  }

  async save(doc) {
    return await UserModel.create(doc);
  }

  async update(id, doc) {
    return await UserModel.findByIdAndUpdate(id, { $set: doc }, { new: true });
  }

  async delete(id) {
    return await UserModel.findByIdAndDelete(id);
  }
}
