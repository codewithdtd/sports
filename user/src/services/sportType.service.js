import BaseService from "./base.service";

class SportType extends BaseService {
    constructor() {
        super('/api/admin/sportType'); 
    }
}

export default new SportType();