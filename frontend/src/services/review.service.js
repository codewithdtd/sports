import { loginFailed, loginStart, loginSuccess } from "../stores/userSlice";
import BaseService from "./base.service";

class Review extends BaseService {
    constructor(user, dispatch) {
        super('/api/admin/review', user, dispatch, loginSuccess); 
    }
    async getOne(data) {
        return (await this.api.post(`/find`, data)).data;
    }
    
}

export default Review;