class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAll() {
    return await this.dao.get({});
  }

  async getUserById(id) {
    return await this.dao.getUserById(id);
  }

  async getUserByEmail(email) {
    return await this.dao.getBy({ email });
  }

  async create(data) {
    return await this.dao.save(data);
  }

  async update(id, data) {
    return await this.dao.update(id, data);
  }

  async delete(id) {
    return await this.dao.delete(id);
  }
}

export default UserRepository;
