import { loginFailed, loginStart, loginSuccess } from "../stores/userSlice";
import BaseService from "./base.service";

class Facility extends BaseService {
    constructor() {
        super('/api/admin/facility'); 
    }
    async getAllBooked(data) {
        return (await this.api.get("/booked", {params: data})).data;
    }
    async getAllBookedExact(data) {
        return (await this.api.get("/booked-exact", {params: data})).data;
    }
    
}

export default new Facility();