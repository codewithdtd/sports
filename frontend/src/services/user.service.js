import { loginFailed, loginStart, loginSuccess } from "../stores/userSlice";
import BaseService from "./base.service";

class UserService extends BaseService {
    constructor() {
        super('/api/user'); 
    }
    async login(data, dispatch, navigate) {
        try {
            dispatch(loginStart());
            const user = (await this.api.post('/login', data)).data;
            console.log(user);
            dispatch(loginSuccess(user));
            navigate("/")
            return user;
        } catch (error) {
            dispatch(loginFailed())
        }
    }
}

export default new UserService();