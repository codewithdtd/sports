import { loginFailed, loginStart, loginSuccess } from "../stores/userSlice";
import BaseService from "./base.service";

class Notify extends BaseService {
    constructor(user, dispatch) {
        super('/api/admin/notify', user, dispatch, loginSuccess); 
    }
    
}

export default Notify;