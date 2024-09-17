import { loginFailed, loginStart, loginSuccess } from "../stores/userSlice";
import BaseService from "./base.service";

class Service extends BaseService {
    constructor() {
        super('/api/admin/service'); 
    }
    
}

export default new Service();