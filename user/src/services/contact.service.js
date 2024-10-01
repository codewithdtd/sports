import BaseService from "./base.service";

class Contact extends BaseService {
    constructor() {
        super('/api/user/contact'); 
    }
}

export default new Contact();