import { loginFailed, loginStart, loginSuccess } from "../stores/userSlice";
import BaseService from "./base.service";

class Time extends BaseService {
    constructor(user, dispatch) {
        super('/api/admin/time', user, dispatch, loginSuccess); 
    }  
}

export default Time;