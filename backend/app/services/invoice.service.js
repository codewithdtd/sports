const db = require('./db.service')
const Invoice = require('../models/invoice.model');

class Invoices extends db {
  constructor() {
    super(Invoice);
  }
  async finAllInvoiceUser(id) {
    try {
      const results = await this.model.find({ "khachHang._id": id,"da_xoa": false });
      return results;
    } catch (err) {
      throw new Error('Error finding document: ' + err.message);
    }
  }
  async filter(filterValue) {
    const convertMongoDateToISO = (mongoDate) => {
      const [datePart] = mongoDate.split(' '); // Extract only the date part
      const [day, month, year] = datePart.split('/');
      return `${year}-${month}-${day}`; // Return in 'yyyy-MM-dd' format
    };
      try {
        const query = { da_xoa: false }; // Bắt đầu với điều kiện không xóa

        // Kiểm tra và thêm các điều kiện lọc nếu có
        if (filterValue.loaiSan) {
          query['datSan.san.loai_San.ten_loai'] = filterValue.loaiSan;
        }
        if (filterValue.phuongThucThanhToan) {
          query.phuongThucThanhToan = filterValue.phuongThucThanhToan;
        }

        const bookings = await this.model.find(query).lean();

        // Lọc thủ công dựa trên việc chuyển đổi `ngayDat` từ `dd/MM/yyyy` sang `yyyy-MM-dd`
        const filteredBookings = bookings.filter((booking) => {
          const ngayDatISO = convertMongoDateToISO(booking.ngayTao_HD);
          return (
            (!filterValue.ngayBatDau || ngayDatISO >= filterValue.ngayBatDau) &&
            (!filterValue.ngayKetThuc || ngayDatISO <= filterValue.ngayKetThuc)
          );
        });

      return filteredBookings;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  };

  // You can add user-specific methods here if needed
}

module.exports = Invoices;