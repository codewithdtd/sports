import { loginFailed, loginStart, loginSuccess } from "../stores/userSlice";
import BaseService from "./base.service";

class User extends BaseService {
    constructor(user, dispatch) {
        super('/api/user', user, dispatch, loginSuccess); 
    }
    async update( id, data, accessToken) {
        return (await this.api.put(`/${id}`, data, {
            headers: {
                token: `Bearer ${accessToken}`
            }
        })).data;
    }
}

export default User;