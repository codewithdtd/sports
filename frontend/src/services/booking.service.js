import { bookingFailed, bookingStart, bookingSuccess } from "../stores/bookingSlice";
import BaseService from "./base.service";

class Booking extends BaseService {
    constructor() {
        super('/api/admin/booking'); 
    }
    async create(data) {
        return (await this.api.post('/', data)).data;
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

export default new Booking();