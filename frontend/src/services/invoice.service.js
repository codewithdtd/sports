import { loginFailed, loginStart, loginSuccess } from "../stores/userSlice";
import BaseService from "./base.service";

class Invoice extends BaseService {
    constructor(user, dispatch) {
        super('/api/admin/invoice', user, dispatch, loginSuccess); 
    }
    async filter(data) {
        return (await this.api.post('/filter', data)).data;
    }
    
}

export default Invoice;