import { loginFailed, loginStart, loginSuccess } from "../stores/userSlice";
import BaseService from "./base.service";

class Facility extends BaseService {
    constructor() {
        super('/api/admin/facility'); 
    }
    
}

export default new Facility();