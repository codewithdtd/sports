import { loginFailed, loginStart, loginSuccess, logoutStart, logoutSuccess, logoutFailed, updateSuccess } from "../stores/userSlice";
import BaseService from "./base.service";
import { persistor } from '../stores/store'; 

class UserService extends BaseService {
    constructor(user, dispatch) {
        super('/api/admin/staff', user, dispatch, loginSuccess); 
    }
    async login(data, dispatch, navigate) {
        try {
            dispatch(loginStart());
            const user = (await this.api.post('/login', data)).data;
            dispatch(loginSuccess(user));
            navigate("/")
            return user;
        } catch (error) {
            dispatch(loginFailed())
        }
    }
    async logout(dispatch, navigate, accessToken) {
        try {
            dispatch(logoutStart());
            const logout = (await this.api.post('/logout', {}, {
                headers: { token: `Bearer ${accessToken}` }
            }));
            dispatch(logoutSuccess(logout));
            persistor.purge().then(() => {
                console.log('Redux persist đã được xóa');
            });
            navigate("/")
        } catch (error) {
            dispatch(logoutFailed())
            console.log(error)
        }
    }
    async update( id, data, accessToken = '', dispatch, navigate) {
        try {
            const user = (await this.api.put(`/${id}`, data, {
                headers: { token: `Bearer ${accessToken}` }
            })).data;
            const action = {
                ...user,
                accessToken: accessToken
            }
            dispatch(updateSuccess(action))
            setTimeout(() => navigate("/"), 2000);
            return user;
        } catch (error) {
            console.log(error)
        }
    }
}

export default UserService;