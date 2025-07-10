class AdoptionRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAll() {
    return await this.dao.get();
  }

  async getById(id) {
    return await this.dao.getBy({ _id: id });
  }

  async getBy(filter) {
    return await this.dao.getBy(filter);
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

export default AdoptionRepository;
