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

  async getBy(params) {
    return await this.dao.getBy(params);
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
