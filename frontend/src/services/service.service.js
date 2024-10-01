import { loginFailed, loginStart, loginSuccess } from "../stores/userSlice";
import BaseService from "./base.service";

class Service extends BaseService {
    constructor(user, dispatch) {
        super('/api/admin/service', user, dispatch, loginSuccess); 
    }
    
}

export default Service;