export default class RepositorioGenerico {
    constructor(dao, model){
        this.dao = dao;
        this.model = model;
    }

    getAll = parametro => this.dao.getAll(parametro, this.model)

    save = parametro => this.dao.save(parametro, this.model)

    getById = parametro => this.dao.getById(parametro, this.model)

    deleteById = parametro => this.dao.deleteById(parametro, this.model)
}