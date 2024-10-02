import { loginFailed, loginStart, loginSuccess } from "../stores/userSlice";
import BaseService from "./base.service";

class Contact extends BaseService {
    constructor(user, dispatch) {
        super('/api/admin/contact', user, dispatch, loginSuccess); 
    }
}

export default Contact;