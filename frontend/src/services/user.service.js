import BaseService from "./base.service";

class UserService extends BaseService {
    constructor() {
        super('/api/user'); 
    }
}

export default new UserService();