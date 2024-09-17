import { loginFailed, loginStart, loginSuccess } from "../stores/userSlice";
import BaseService from "./base.service";

class Invoice extends BaseService {
    constructor() {
        super('/api/admin/invoice'); 
    }
    
}

export default new Invoice();