import UserModel from "../models/users.model.js";

export default class UsersDAO {
  get = (params) => {
    return UserModel.find(params);
  };

  getBy = (params) => {
    return UserModel.findOne(params);
  };

  save = (doc) => {
    return UserModel.create(doc);
  };

  update = (id, doc) => {
    return UserModel.findByIdAndUpdate(id, { $set: doc }, { new: true });
  };

  delete = (id) => {
    return UserModel.findByIdAndDelete(id);
  };
}
