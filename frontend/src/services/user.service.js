import { loginFailed, loginStart, loginSuccess } from "../stores/userSlice";
import BaseService from "./base.service";

class User extends BaseService {
    constructor() {
        super('/api/user'); 
    }
    
}

export default new User();