import { loginFailed, loginStart, loginSuccess } from "../stores/userSlice";
import BaseService from "./base.service";

class Facility extends BaseService {
    constructor(user, dispatch) {
        super('/api/admin/facility', user, dispatch, loginSuccess); 
    }
    async getByType(data) {
        return (await this.api.post('/find', data)).data;
    }
    async getAllBooked(data) {
        return (await this.api.get("/booked", {params: data})).data;
    }
    async getAllBookedExact(data) {
        return (await this.api.get("/booked-exact", {params: data})).data;
    }
    
}

export default Facility;