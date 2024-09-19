import { loginFailed, loginStart, loginSuccess } from "../stores/userSlice";
import BaseService from "./base.service";

class User extends BaseService {
    constructor() {
        super('/api/user'); 
    }
    async update( id, data, accessToken) {
        return (await this.api.put(`/${id}`, data, {
            headers: {
                token: `Bearer ${accessToken}`
            }
        })).data;
    }
}

export default new User();