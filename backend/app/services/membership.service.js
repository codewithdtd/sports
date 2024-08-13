const db = require('./db.service')
const { Membership, UserMembership } = require('../models/membership.model');
// const Membership = require('../models/membership.model');

class Memberships extends db {
  constructor() {
    super(Membership);
  }
  
//   async findAllUser(id) {
//     try {
//       let result = await this.model.find(
//         { "hoiVien.ma_KH": id }
//       ) 
//       let matchedHoiVien = [];
//       if (result.length > 0) {
//         result.forEach(result => {
//           const filteredHoiVien = result.hoiVien.filter(hv => hv.ma_KH === id);
//           matchedHoiVien.push(...filteredHoiVien);
//           console.log("Thông tin hội viên từ một document:", matchedHoiVien);
//         });
//         return matchedHoiVien;
//       } else {
//         console.log("Không tìm thấy hội viên có ma_KH là KH001");
//       }
//       if (!result) {
//         throw new Error('Document not found');
//       }
//       // return result;
//     } catch (err) {
//       throw new Error('Error finding document: ' + err.message);
//     }
//   }
}

class UserMemberships extends db {
  constructor() {
    super(UserMembership);
  }
}

module.exports = { Memberships, UserMemberships };
// module.exports = Memberships;