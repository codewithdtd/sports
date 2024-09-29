import BaseService from "./base.service";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from '../stores/userSlice';
import { createAxiosInstance } from "./createInstance.service";
// const dispatch = useDispatch()

class Booking extends BaseService {
    // constructor() {
    //     super('/api/user/booking'); 
    // }
    constructor(user, dispatch) {
        super('/api/user/booking', user, dispatch, loginSuccess);
    }
    async getAll(id, accessToken, dispatch) {
        return (await this.api.get("/", { params: id })).data;
    }
}

// export default new Booking();
export default Booking;