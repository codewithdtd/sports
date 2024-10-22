import { updateSuccess, loginFailed, loginStart, loginSuccess, logoutStart, logoutSuccess, logoutFailed } from "../stores/userSlice";
import BaseService from "./base.service";
import { persistor } from '../stores/store'; 

class UserService extends BaseService {
    // constructor() {
    //     super('/api/user'); 
    // }
    constructor(user, dispatch) {
        super('/api/user', user, dispatch, loginSuccess);
        this.dispatch = dispatch;
    }
    async update( id, data, accessToken = '', dispatch, navigate) {
        try {
            const user = (await this.api.put(`/${id}`, data, {
                headers: { 
                    token: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
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
            await persistor.purge().then(() => {
                dispatch({ type: 'RESET_REDUX_STATE' });
                console.log('Redux persist đã được xóa');
            });
            navigate("/")
        } catch (error) {
            dispatch(logoutFailed())
            console.log(error)
        }
    }
    async payment(data, accessToken) {
        const user = (await this.api.post(`/payment`, data, {
                headers: { 
                    token: `Bearer ${accessToken}`,
                }
            })).data;
            console.log(user)
        return user;
    }
    async paymentStatus(id) {
        const user = (await this.api.post(`/payment-status${id}`, data, {
                headers: { 
                    // token: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            })).data;
        return user;    
    }
}

export default UserService;