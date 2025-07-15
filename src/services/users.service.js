import UsersDTO from "../dto/users.dto.js";

class UserService {
  constructor(repository) {
    this.repository = repository;
  }

  async getAll() {
    const users = await this.repository.getAll();
    return users.map((user) => new UsersDTO(user));
  }

  async getUserById(id) {
    const user = await this.repository.getUserById(id);
    if (!user) return null;
    return new UsersDTO(user);
  }

  async getUserByEmail(email) {
    const user = await this.repository.getUserByEmail(email);
    if (!user) return null;
    return new UsersDTO(user);
  }

  async getRawUserByEmail(email) {
    return await this.repository.getRawUserByEmail(email);
  }

  async createUser(userData) {
    const createdUser = await this.repository.create(userData);
    return new UsersDTO(createdUser);
  }

  async updateUser(id, updateData) {
    const updated = await this.repository.update(id, updateData);
    if (!updated) throw new Error("User not found");
    return new UsersDTO(updated);
  }

  async deleteUser(id) {
    const deleted = await this.repository.delete(id);
    if (!deleted) throw new Error("User not found");
    return deleted;
  }

  getUserTokenData(user) {
    return UsersDTO.getUserTokenFrom(user);
  }
}

export default UserService;
