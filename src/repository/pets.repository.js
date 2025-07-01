class PetsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAll() {
    return await this.dao.get({});
  }

  async getById(id) {
    return await this.dao.getBy({ _id: id });
  }

  async create(doc) {
    return await this.dao.save(doc);
  }

  async update(id, doc) {
    return await this.dao.update(id, doc);
  }

  async delete(id) {
    return await this.dao.delete(id);
  }
}

export default PetsRepository;
