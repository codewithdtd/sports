import BaseService from "./base.service";

class Cart extends BaseService {
    constructor() {
        super('/api/admin/sportType'); 
    }
}

export default new Cart();