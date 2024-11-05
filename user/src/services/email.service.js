import BaseService from "./base.service";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from '../stores/userSlice';
import { createAxiosInstance } from "./api.service";
// const dispatch = useDispatch()

class Email extends BaseService {
    // constructor() {
    //     super('/api/user/booking'); 
    // }
    constructor(user, dispatch) {
        super('/api/admin/email', user, dispatch, loginSuccess);
    }
}

// export default new Booking();
export default Email;