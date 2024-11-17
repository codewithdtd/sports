import BaseService from "./base.service";

class Review extends BaseService {
    constructor(user, dispatch) {
        super('/api/user/review', user); 
    }
    async getOne(data) {
        return (await this.api.post(`/find`, data)).data;
    }
}

// export default new Review();
export default Review;