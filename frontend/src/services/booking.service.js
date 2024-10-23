import { bookingFailed, bookingStart, bookingSuccess } from "../stores/bookingSlice";
import { loginSuccess } from '../stores/userSlice'
import BaseService from "./base.service";

class Booking extends BaseService {
    constructor(user, dispatch) {
        super('/api/admin/booking', user, dispatch, loginSuccess); 
    }
    async create(data) {
        return (await this.api.post('/', data)).data;
    }
    async getToday(data) {
        return (await this.api.post('/today', data)).data;
    }
    async filter(data) {
        return (await this.api.post('/filter', data)).data;
    }
    // async getAll(dispatch) {
    //     try {
    //         dispatch(bookingStart());
    //         const booking = (await this.api.post('/', data)).data;
    //         console.log(booking);
    //         dispatch(bookingSuccess(booking));
    //         return booking;
    //     } catch (error) {
    //         dispatch(bookingFailed())
    //     }
    // }
}

export default Booking;