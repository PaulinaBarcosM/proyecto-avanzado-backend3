class SessionsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getUserByEmail(email) {
    return await this.dao.getBy({ email });
  }

  async getByEmail(email) {
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

export default SessionsRepository;
