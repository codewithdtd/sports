const Staffs = require("../services/staff.service");
const Facilities = require("../services/facility.service");
const Bookings = require("../services/booking.service");
const Invoices = require("../services/invoice.service");
const Equipment = require("../services/equipment.service");
const GoodsReceivedNotes = require("../services/goodsReceivedNote.service");
const { Memberships, UserMemberships } = require("../services/membership.service");
const { Events, UserEvents } = require("../services/event.service");
const Reviews = require("../services/review.service");
const Services = require("../services/service.service");
const SportTypes = require("../services/sportType.service");
const Customers = require("../services/user.service");
const Contacts = require("../services/contact.service");
const Notifies = require("../services/notify.service");


const ApiError = require("../api-error");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const bcrypt = require("bcrypt");

const fs = require('fs');
const path = require('path');
const Times = require("../services/time.service");


const convertToDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`; // JavaScript sử dụng tháng từ 0-11
}
const convertToDateReverse = (dateStr) => {
    if (dateStr.includes("-")) {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    }
    return dateStr;
}

exports.createStaff = async (req, res, next) => {
    const staff = new Staffs();
    const newStaff = req.body;
    salt = await bcrypt.genSalt(10);
    newStaff.matKhau_NV = await bcrypt.hash(newStaff.matKhau_NV, salt);
    try {
        const exits = await staff.findOne({sdt_NV: newStaff.sdt_NV})
        if(exits) {
            res.status(409).json({error: 'Tài khoản đã được đăng ký!!!'})
        }
        else {
            const result = await staff.create(newStaff);
            res.status(201).json(result);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateStaff = async (req, res, next) => {
    const staff = new Staffs();
    try {
        const newUpdate = req.body;
        console.log(req.file)
        const oldUser = await staff.findById(req.params.id);
        if(newUpdate.matKhauCu) {
            let oldPass = newUpdate.matKhauCu;
            const user = await staff.findById(req.params.id);
            const validPassword = await bcrypt.compare(
                oldPass,
                user.matKhau_NV
            )
            console.log(validPassword)
            if(validPassword) {
                salt = await bcrypt.genSalt(10);
                newUpdate.matKhau_NV = await bcrypt.hash(newUpdate.matKhauMoi, salt);
            }
            else {
                return res.status(401).json({ error: 'Sai mật khẩu'});             
            }
        }

        let hinhAnhDaiDien = null;
        if (req.file) {
            if(oldUser.hinhAnh_NV) {
                const oldImagePath = path.join(__dirname, '../uploads/', oldUser.hinhAnh_NV);
                fs.access(oldImagePath, fs.constants.F_OK, (err) => {
                    if (!err) {
                        fs.unlink(oldImagePath, (err) => {
                            if (err) {
                                console.error('Lỗi khi xóa ảnh cũ:', err);
                            } else {
                                console.log('Ảnh cũ đã được xóa:', oldUser.hinhAnhDaiDien);
                            }
                        });
                    }
                });
            }
            console.log(req.file)
            hinhAnhDaiDien = req.file.filename;
            newUpdate.hinhAnh_NV = hinhAnhDaiDien;
        }


        const result = await staff.update(req.params.id, newUpdate);
        const { matKhau_NV, ...others } = result._doc;
        res.status(201).json(others);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res, next) => {
    const staff = new Staffs();
    try {
        const result = await staff.findOne({"sdt_NV": req.body.sdt_NV});
        if(!result) {
            return next(
                new ApiError(404, "Số điện thoại không hợp lệ!")
            );
        }
        const validPassword = await bcrypt.compare(
            req.body.matKhau_NV,
            result.matKhau_NV
        )
        if(!validPassword) {
            return next(
                new ApiError(404, "Sai mật khẩu!")
            );
        }
        if(validPassword && result) {
            const accessToken = jwt.sign(
                {
                    id: result.id,
                    role: result.chuc_vu
                },  
                process.env.JWT_ACCESS_TOKEN,
                { expiresIn: "20d" }
            );
            // refresh
            const refreshToken = jwt.sign(
                {
                    id: result.id,
                    role: result.chuc_vu
                },  
                process.env.JWT_REFRESH_TOKEN,
                { expiresIn: "45d" }
            );

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                path: "/",
                sameSite: "strict",
                maxAge: 14 * 24 * 60 * 60 * 1000,
            });


            const {matKhau_NV, ...others} = result._doc;
            res.status(200).json({user: others, accessToken: accessToken});
        }
    } catch (err) {
        return next(
            new ApiError(500, "Đã có lỗi xảy ra trong quá trình đăng nhập!") 
        );
    }
};

exports.refreshToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) {
        return next(
            new ApiError(401, "You're not authenticated!")
        );
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, user) => {
        if(err) {
            return next(
                new ApiError(403, "Token is not valid!")
            );
        }
        const newAccessToken = jwt.sign(
            {
                id: user.id,
                role: user.role
            },  
            process.env.JWT_ACCESS_TOKEN,
            { expiresIn: "20d" }
        );
        // refresh
        const newRefreshToken = jwt.sign(
            {
                id: user.id,
                role: user.role
            },  
            process.env.JWT_REFRESH_TOKEN,
            { expiresIn: "45d" }
        );

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            path: "/",
            sameSite: "strict",
            maxAge: 14 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({accessToken: newAccessToken});
    })

}

exports.logout = async (req, res, next) => {
    res.clearCookie("refreshToken");
    res.send({ message: "Logout" });
};

exports.findAllStaff = async (req, res, next) => {
    const staff = new Staffs();
    try {
        const result = await staff.findAll();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findOneStaff = async (req, res, next) => {
    const staff = new Staffs();
    try {
        let result;
        if(!req.params.id) 
            result = await staff.findOne(req.body)
        else 
            result = await staff.findById(req.params.id)
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// exports.findByIdStaff = async (req, res, next) => {
//     const staff = new Staffs();
//     try {
//         const result = await staff.findOne(req.params.id);
//         res.status(201).json(result);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

exports.deleteOneStaff = async (req, res, next) => {
    const staff = new Staffs();
    try {
        const result = await staff.delete(req.params.id);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// FACILITY
// Sân thể thao
// 
exports.createFacility = async (req, res, next) => {
    const facility = new Facilities();
    const newFacility = req.body;
    try {
        const result = await facility.create(newFacility);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateFacility = async (req, res, next) => {
    const facility = new Facilities();
    try {
        const result = await facility.update(req.params.id, req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findAllFacility = async (req, res, next) => {
    const facility = new Facilities();
    try {
        const result = await facility.findAll();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findFacility = async (req, res, next) => {
    const facility = new Facilities();
    try {
        const result = await facility.find(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.findOneFacility = async (req, res, next) => {
    const facility = new Facilities();
    try {
        let result;
        if(!req.params.id) 
            result = await facility.findOne(req.body)
        else 
            result = await facility.findById(req.params.id) 
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findAllFacilityBooking = async (req, res, next) => {
    const facility = new Facilities();
    const booking = new Bookings();
    
    try {
        const listField = await facility.findAll();
        const time = req.query;
        time.ngayDat = convertToDateReverse(time.ngayDat);
        // const listBooking = await booking.findBookingBooked(time);
        const listBooking = await facility.findAllBooked(time);
        let result = listField.map(field => field.toObject());
        // Tạo một map từ listBooking để tra cứu nhanh
        const bookingMap = new Map(listBooking.map(booking => [booking._id.toString(), booking]));
        const bookingArray = Array.from(bookingMap.values());

        // Duyệt qua listField và thay thế các phần tử trùng lặp
        result = result.map(field => {
            // Chuyển đổi ObjectId thành chuỗi để so sánh
            if (bookingMap.has(field._id.toString())) {
                return {
                    ...field,
                    ...bookingMap.get(field._id.toString()) // Thay thế hoặc thêm các thuộc tính từ bookingMap
                };
            }
            return field;
        });
        
        res.status(201).json(listBooking);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}

exports.findAllFacilityBookingExact = async (req, res, next) => {
    const facility = new Facilities();
    const booking = new Bookings();
    
    try {
        const listField = await facility.findAll();
        const time = req.query;
        time.ngayDat = convertToDateReverse(time.ngayDat);
        const listBooking = await facility.findAllBookedExact(time);
        let result = listField.map(field => field.toObject());
        // Tạo một map từ listBooking để tra cứu nhanh
        const bookingMap = new Map(listBooking.map(booking => [booking._id.toString(), booking]));
        // console.log(bookingMap)

        // Duyệt qua listField và thay thế các phần tử trùng lặp
       result = result.map(field => {
            // Chuyển đổi ObjectId thành chuỗi để so sánh
            if (bookingMap.has(field._id.toString())) {
                return {
                    ...field,
                    ...bookingMap.get(field._id.toString()) // Thay thế hoặc thêm các thuộc tính từ bookingMap
                };
            }
            return field;
        });

        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// exports.findByIdFacility = async (req, res, next) => {
//     const facility = new Facilities();
//     try {
//         const result = await facility.findById(req.params.id);
//         res.status(201).json(result);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

exports.deleteOneFacility = async (req, res, next) => {
    const facility = new Facilities();
    try {
        const result = await facility.delete(req.params.id);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// Đặt sân 
// 
// 
exports.createBooking = async (req, res, next) => {
    const booking = new Bookings();
    const service = new Services();
    try {
        const newBooking = req.body;
        const newDichVu = newBooking.dichVu || [];

        for(let newService of newDichVu) {
            let temp = await service.findById(newService._id)

            const r = await service.update(newService._id, { tonKho: temp._doc.tonKho - newService.soluong });
        }
        newBooking.ngayDat = convertToDateReverse(newBooking.ngayDat)
        const result = await booking.create(newBooking);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.updateBooking = async (req, res, next) => {
    const booking = new Bookings();
    const service = new Services();
    try {
        // const services = await service.findAll();
        const updateBooking = req.body;
        updateBooking.ngayDat =  convertToDateReverse(updateBooking.ngayDat)
        const currentBooking = await booking.findById(updateBooking._id)
        const currentDichVu = currentBooking.dichVu || [];

        const newDichVu = updateBooking.dichVu || [];
        if(updateBooking.trangThai == 'Đã hủy') {
            for(let newService of newDichVu) {
                let temp = await service.findById(newService._id)
                // Xóa dịch vụ không còn tồn tại trong danh sách mới
                await service.update(newService._id, { tonKho: temp._doc.tonKho + newService.soluong });
                
            };
        }

        for(let newService of newDichVu) {
            const existingService = currentDichVu.find(
                (service) => service._id === newService._id
            );

            if (existingService) {
                // Nếu dịch vụ tồn tại, kiểm tra xem số lượng có thay đổi không
                if (existingService.soluong !== newService.soluong) {
                    let temp = await service.findById(existingService._id)
                    // Cập nhật dịch vụ với số lượng mới
                    await service.update(newService._id, { tonKho: temp._doc.tonKho - (newService.soluong - existingService.soluong) });
                }
            } else {
                
                // Nếu dịch vụ không tồn tại, thêm mới
                let temp = await service.findById(newService._id)

                await service.update(newService._id, { tonKho: temp._doc.tonKho - newService.soluong });
            }
        };

        // Kiểm tra và xóa các dịch vụ không còn trong danh sách mới
        for(let existingService of currentDichVu) {
            const stillExists = newDichVu.find(
                (newService) => newService._id === existingService._id
            );

            if (!stillExists) {
                let temp = await service.findById(existingService._id)
                // Xóa dịch vụ không còn tồn tại trong danh sách mới
                await service.update(existingService._id, { tonKho: temp._doc.tonKho + existingService.soluong });

            }
        };

   

        console.log(updateBooking.ngayDat)
        const result = await booking.update(req.params.id, updateBooking);
        // console.log(result)
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.findAllBooking = async (req, res, next) => {
    const booking = new Bookings();
    try {
        const result = await booking.findAll();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.findOneBooking = async (req, res, next) => {
    const booking = new Bookings();
    try {
        let result;
        if(!req.params.id) 
            result = await booking.findOne(req.body)
        else 
            result = await booking.findById(req.params.id) 
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.findAllBooking = async (req, res, next) => {
    const booking = new Bookings();
    try {
        const result = await booking.findAll();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.findAllBookingToday = async (req, res, next) => {
    const booking = new Bookings();
    try {
        const result = await booking.findBookingBookedFromToday(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.findBooking = async (req, res, next) => {
    const booking = new Bookings();
    try {
        const result = await booking.find(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.filterBooking = async (req, res, next) => {
    const booking = new Bookings();
    try {
        const result = await booking.filterBookings(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// Hóa đơn
// 
// 
exports.createInvoice = async (req, res, next) => {
    const invoice = new Invoices();
    try {
        const result = await invoice.create(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.updateInvoice = async (req, res, next) => {
    const invoice = new Invoices();
    try {
        const result = await invoice.update(req.params.id, req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.findAllInvoice = async (req, res, next) => {
    const invoice = new Invoices();
    try {
        const result = await invoice.findAll();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.findOneInvoice = async (req, res, next) => {
    const invoice = new Invoices();
    try {
        let result;
        if(!req.params.id) 
            result = await invoice.findOne(req.body)
        else 
            result = await invoice.findById(req.params.id) 
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.filterInvoice = async (req, res, next) => {
    const invoice = new Invoices();
    try {
        const result = await invoice.filter(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// Dụng  cụ thiết bị
// 
// 
exports.createEquipment = async (req, res, next) => {
    const equipment = new Equipment();
    const newEquipment = req.body;
    try {
        const result = await equipment.create(newEquipment);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateEquipment = async (req, res, next) => {
    const equipment = new Equipment();
    try {
        const result = await equipment.update(req.params.id, req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findAllEquipment = async (req, res, next) => {
    const equipment = new Equipment();
    try {
        const result = await equipment.findAll();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findOneEquipment = async (req, res, next) => {
    const equipment = new Equipment();
    try {
        let result;
        if(!req.params.id) 
            result = await equipment.findOne(req.body)
        else 
            result = await equipment.findById(req.params.id) 
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteOneEquipment = async (req, res, next) => {
    const equipment = new Equipment();
    try {
        const result = await equipment.delete(req.params.id);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Nhập kho
// 
// 
exports.createGoodReceivedNote = async (req, res, next) => {
    const goodsReceivedNote = new GoodsReceivedNotes();
    const newEquipment = req.body;
    try {
        const result = await goodsReceivedNote.create(newEquipment);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateGoodReceivedNote = async (req, res, next) => {
    const goodsReceivedNote = new GoodsReceivedNotes();
    try {
        const result = await goodsReceivedNote.update(req.params.id, req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findAllGoodReceivedNote = async (req, res, next) => {
    const goodsReceivedNote = new GoodsReceivedNotes();
    try {
        const result = await goodsReceivedNote.findAll();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findOneGoodReceivedNote = async (req, res, next) => {
    const goodsReceivedNote = new GoodsReceivedNotes();
    try {
        let result;
        if(!req.params.id) 
            result = await goodsReceivedNote.findOne(req.body)
        else 
            result = await goodsReceivedNote.findById(req.params.id) 
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteOneGoodReceivedNote = async (req, res, next) => {
    const goodsReceivedNote = new GoodsReceivedNotes();
    try {
        const result = await goodsReceivedNote.delete(req.params.id);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Gói thành viên
// 
// 
exports.createMembership = async (req, res, next) => {
    const membership = new Memberships();
    const newEquipment = req.body;
    try {
        const result = await membership.create(newEquipment);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateMembership = async (req, res, next) => {
    const membership = new Memberships();
    try {
        const result = await membership.update(req.params.id, req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findAllMembership = async (req, res, next) => {
    const membership = new Memberships();
    try {
        const result = await membership.findAll();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findOneMembership = async (req, res, next) => {
    const membership = new Memberships();
    try {
        let result;
        if(!req.params.id) 
            result = await membership.findOne(req.body)
        else 
            result = await membership.findById(req.params.id) 
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteOneMembership = async (req, res, next) => {
    const membership = new Memberships();
    try {
        const result = await membership.delete(req.params.id);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Đăng ký gói hội viên
// 
// 
exports.createUserMembership = async (req, res, next) => {
    const userMembership = new UserMemberships();
    const membership = new Memberships();
    
    try {
        const newUserMembership = req.body;
        const goiHV = await membership.findById(newUserMembership.ma_GoiHV);
        newUserMembership.ngayBatDau = convertToDateReverse(newUserMembership.ngayBatDau)
        function parseDate(str) {
            const [day, month, year] = str.split('/').map(Number); // Tách ngày, tháng, năm
            return new Date(year, month - 1, day); // Tạo đối tượng Date (tháng bắt đầu từ 0)
        }
        function formatDate(date) {
            const day = String(date.getDate()).padStart(2, '0');  // Lấy ngày và thêm số 0 nếu cần
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 nên cần +1
            const year = date.getFullYear();
            return `${day}/${month}/${year}`; // Trả về chuỗi theo định dạng dd/mm/yyyy
        }
        const ngayBatDau = parseDate(newUserMembership.ngayBatDau);
    
        const ngayKetThuc = new Date(ngayBatDau);
        ngayKetThuc.setDate(ngayBatDau.getDate() + goiHV._doc.thoiHan);
        newUserMembership.ngayKetThuc = formatDate(ngayKetThuc);
        
        const result = await userMembership.create(newUserMembership);
        console.log(result)
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUserMembership = async (req, res, next) => {
    const userMembership = new UserMemberships();
    try {
        const result = await userMembership.update(req.params.id, req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findAllUserMembership = async (req, res, next) => {
    const userMembership = new UserMemberships();
    const membership = new Memberships();
    const customer = new Customers();
    try {
        let result = await userMembership.findAll();
        if(req.body) 
            result = await userMembership.find(req.body);
        function tinhChenhLechNgay(ngayNhap) {
            const [day, month, year] = ngayNhap.split('/').map(Number);
            const date1 = new Date(year, month - 1, day);  // Ngày bạn nhập (dd/mm/yyyy)
            const date2 = new Date();            // Ngày hiện tại

            // Tính số mili-giây giữa hai ngày
            const diffInMs = date1 - date2;

            // Chuyển mili-giây thành số ngày
            const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)); // Làm tròn lên

            return diffInDays;
        }
        
        const newResult = [];
        for (const element of result) {
            const goiHV = await membership.findById(element.ma_GoiHV);
            const khachHang = await customer.findById(element.ma_KH);
            const { matKhau_KH, ...other } = khachHang._doc;
            
            if(tinhChenhLechNgay(element._doc.ngayKetThuc) < 1) {
                element.trangThai = 'Hết hạn';
                await userMembership.update(element._doc._id, element._doc)
            } 
            if(tinhChenhLechNgay(element._doc.ngayKetThuc) < 4 && tinhChenhLechNgay(element._doc.ngayKetThuc) > 0 ) {
                element.trangThai = 'Sắp hết hạn';
                await userMembership.update(element._doc._id, element._doc)
            }
            // Thêm thông tin khách hàng và gói hội viên vào kết quả
            newResult.push({
                ...element._doc,
                soNgay: tinhChenhLechNgay(element._doc.ngayKetThuc),  // Lấy dữ liệu từ bản ghi hiện tại
                goiHV: goiHV._doc,            // Thông tin gói hội viên
                khachHang: other       // Thông tin khách hàng
            });
        }
        res.status(201).json(newResult);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findOneUserMembership = async (req, res, next) => {
    const userMembership = new UserMemberships();
    const membership = new Memberships();
    const customer = new Customers();
    try {
        let result;
        if(!req.params.id) 
            result = await userMembership.findOne(req.body)
        else 
            result = await userMembership.findById(req.params.id) 

        const goiHV = await membership.findById(result.ma_GoiHV);
        const khachHang = await customer.findById(result.ma_KH);
        const { matKhau_KH, ...other } = khachHang._doc;

        const newResult = {
            ...result._doc,
            goiHV: goiHV._doc,
            khachHang: other
        }
        res.status(201).json(newResult);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteOneUserMembership = async (req, res, next) => {
    const userMembership = new UserMemberships();
    try {
        const result = await userMembership.delete(req.params.id);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Tạo sự kiện, giải đấu
// 
// 
exports.createEvent = async (req, res, next) => {
    const event = new Events();
    const newEvent = req.body;
    try {
        const result = await event.create(newEvent);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateEvent = async (req, res, next) => {
    const event = new Events();
    try {
        const result = await event.update(req.params.id, req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findAllEvent = async (req, res, next) => {
    const event = new Events();
    try {
        const result = await event.findAll();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findOneEvent = async (req, res, next) => {
    const event = new Events();
    try {
        let result;
        if(!req.params.id) 
            result = await event.findOne(req.body)
        else 
            result = await event.findById(req.params.id) 
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteOneEvent = async (req, res, next) => {
    const event = new Events();
    try {
        const result = await event.delete(req.params.id);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Đăng ký giải đấu
// 
// 
exports.createUserEvent = async (req, res, next) => {
    const userEvent = new UserEvents();
    const newUserEvent = req.body;
    try {
        const result = await userEvent.create(newUserEvent);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUserEvent = async (req, res, next) => {
    const userEvent = new UserEvents();
    try {
        const result = await userEvent.update(req.params.id, req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findAllUserEvent = async (req, res, next) => {
    const userEvent = new UserEvents();
    try {
        const result = await userEvent.findAll();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findOneUserEvent = async (req, res, next) => {
    const userEvent = new UserEvents();
    try {
        let result;
        if(!req.params.id) 
            result = await userEvent.findOne(req.body)
        else 
            result = await userEvent.findById(req.params.id) 
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteOneUserEvent = async (req, res, next) => {
    const userEvent = new UserEvents();
    try {
        const result = await userEvent.delete(req.params.id);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Đánh giá
exports.createReview = async (req, res, next) => {
    const review = new Reviews();
    const newReview = req.body;
    try {
        const result = await review.create(newReview);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateReview = async (req, res, next) => {
    const review = new Reviews();
    try {
        const result = await review.update(req.params.id, req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findAllReview = async (req, res, next) => {
    const review = new Reviews();
    try {
        const result = await review.findAll();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findOneReview = async (req, res, next) => {
    const review = new Reviews();
    try {
        let result;
        if(!req.params.id) 
            result = await review.findOne(req.body)
        else 
            result = await review.findById(req.params.id) 
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteOneReview = async (req, res, next) => {
    const review = new Reviews();
    try {
        const result = await review.delete(req.params.id);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Dịch vụ
exports.createService = async (req, res, next) => {
    const service = new Services();
    const newService = req.body;
    try {
        const result = await service.create(newService);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateService = async (req, res, next) => {
    const service = new Services();
    try {
        const result = await service.update(req.params.id, req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findAllService = async (req, res, next) => {
    const service = new Services();
    try {
        const result = await service.findAll();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findOneService = async (req, res, next) => {
    const service = new Services();
    try {
        let result;
        if(!req.params.id) 
            result = await service.findOne(req.body)
        else 
            result = await service.findById(req.params.id) 
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteOneService = async (req, res, next) => {
    const service = new Services();
    try {
        const result = await service.delete(req.params.id);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Loại sân
exports.createSportType = async (req, res, next) => {
    const sportType = new SportTypes();
    // console.log(req.files['hinhAnhDaiDien'])
    try {
        const { ten_loai } = req.body;
        if (!req.files) {
            return res.status(400).json({ error: 'No files were uploaded.' });
        }
        // Kiểm tra và xử lý file hình ảnh chính
        let hinhAnh = [];
        if (req.files['hinhAnh']) {
            // Kiểm tra xem req.files['hinhAnh'] có phải là một mảng không
            if (Array.isArray(req.files['hinhAnh'])) {
                hinhAnh = req.files['hinhAnh'].map((file) => file.filename); // Lấy tên file
            } else {
                // Nếu chỉ có một file, biến nó thành mảng
                hinhAnh = [req.files['hinhAnh'].filename];
            }
        }

        // Kiểm tra và xử lý file hình ảnh đại diện
        let hinhAnhDaiDien = null;
        if (req.files['hinhAnhDaiDien']) {
            // Kiểm tra xem req.files['hinhAnhDaiDien'] có phải là một mảng không
            if (Array.isArray(req.files['hinhAnhDaiDien'])) {
                hinhAnhDaiDien = req.files['hinhAnhDaiDien'][0].filename; // Lấy tên file
            } else {
                // Nếu chỉ có một file, lấy tên file trực tiếp
                hinhAnhDaiDien = req.files['hinhAnhDaiDien'].filename;
            }
        }

        const newService = {
            ten_loai: ten_loai,
            hinhAnh: hinhAnh,
            hinhAnhDaiDien: hinhAnhDaiDien
        };
        const result = await sportType.create(newService);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateSportType = async (req, res, next) => {
    const sportType = new SportTypes();
    try {
        const { ten_loai } = req.body;
        let newService = { ten_loai: ten_loai };
        const existFile = await sportType.findById(req.params.id);

        // Kiểm tra và xử lý file hình ảnh chính
        if (req.files && req.files['hinhAnh']) {
            let hinhAnh = [];
            if (Array.isArray(req.files['hinhAnh'])) {
                hinhAnh = req.files['hinhAnh'].map((file) => file.filename); // Lấy tên file
            } else {
                hinhAnh = [req.files['hinhAnh'].filename]; // Nếu chỉ có một file, biến nó thành mảng
            }

            // Chỉ thêm thuộc tính hinhAnh nếu có file
            if (hinhAnh.length > 0) {
                newService.hinhAnh = [...existFile.hinhAnh, ...hinhAnh]; // Thêm file mới vào mảng hình ảnh hiện tại
            } else {
                newService.hinhAnh = existFile.hinhAnh; // Nếu không có file mới, giữ nguyên mảng hình ảnh cũ
            }
        }

        // Kiểm tra và xử lý file hình ảnh đại diện
        if (req.files && req.files['hinhAnhDaiDien']) {
            let hinhAnhDaiDien = null;
            const oldAvatar = await sportType.findById(req.params.id);
            if(oldAvatar.hinhAnhDaiDien) {
                const appDir = path.dirname(__dirname);  //Thư mục cha
                const filePath = path.join(appDir, 'uploads', oldAvatar.hinhAnhDaiDien);
                fs.unlinkSync(filePath);
            }
            if (Array.isArray(req.files['hinhAnhDaiDien'])) {
                hinhAnhDaiDien = req.files['hinhAnhDaiDien'][0].filename; // Lấy tên file
            } else {
                hinhAnhDaiDien = req.files['hinhAnhDaiDien'].filename; // Nếu chỉ có một file, lấy tên file trực tiếp
            }
    
            // Chỉ thêm thuộc tính hinhAnhDaiDien nếu có file
            if (hinhAnhDaiDien) {
                newService.hinhAnhDaiDien = hinhAnhDaiDien;
            }
        }
        const result = await sportType.update(req.params.id, newService);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteImageSportType = async (req, res, next) => {
    const sportType = new SportTypes();
    try {
        const imagePath = req.query.hinhAnh;
        const appDir = path.dirname(__dirname);  //Thư mục cha
        const filePath = path.join(appDir, 'uploads', imagePath);
        fs.unlinkSync(filePath);


        const result = await sportType.deleteImage(req.params.id, imagePath);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.findAllSportType = async (req, res, next) => {
    const sportType = new SportTypes();
    try {
        const result = await sportType.findAll();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findOneSportType = async (req, res, next) => {
    const sportType = new SportTypes();
    try {
        let result;
        if(!req.params.id) 
            result = await sportType.findOne(req.body)
        else 
            result = await sportType.findById(req.params.id) 
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteOneSportType = async (req, res, next) => {
    const sportType = new SportTypes();
    try {
        const result = await sportType.delete(req.params.id);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Liên hệ
exports.createContact = async (req, res, next) => {
    const contact = new Contacts();
    const newReview = req.body;
    try {
        const result = await contact.create(newReview);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateContact = async (req, res, next) => {
    const contact = new Contacts();
    try {
        const result = await contact.update(req.params.id, req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findAllContact = async (req, res, next) => {
    const contact = new Contacts();
    try {
        const result = await contact.findAll();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findOneContact = async (req, res, next) => {
    const contact = new Contacts();
    try {
        let result;
        if(!req.params.id) 
            result = await contact.findOne(req.body)
        else 
            result = await contact.findById(req.params.id) 
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteOneContact = async (req, res, next) => {
    const contact = new Contacts();
    try {
        const result = await contact.delete(req.params.id);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Thông báo 
exports.createNotify = async (req, res, next) => {
    const notify = new Notifies();
    const newReview = req.body;
    try {
        const result = await notify.create(newReview);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateNotify = async (req, res, next) => {
    const notify = new Notifies();
    try {
        const result = await notify.update(req.params.id, req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findAllNotify = async (req, res, next) => {
    const notify = new Notifies();
    try {
        if(req.user.role && (req.user.role == 'admin' || req.user.role == 'Nhân viên')) {
            const result = await notify.find({nguoiDung: 'Nhân viên'});
            return res.status(201).json(result);
        }
        else {
            const result = await notify.find({nguoiDung: req.params.id});
            res.status(201).json(result);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findOneNotify = async (req, res, next) => {
    const notify = new Notifies();
    try {
        let result;
        if(!req.params.id) 
            result = await notify.findOne(req.body)
        else 
            result = await notify.findById(req.params.id) 
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteOneNotify = async (req, res, next) => {
    const notify = new Notifies();
    try {
        const result = await notify.delete(req.params.id);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Thời gian
exports.findTime = async (req, res, next) => {
    const notify = new Times();
    try {
        const result = await notify.findAll();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTime = async (req, res, next) => {
    const notify = new Times();
    try {
        const result = await notify.update(req.params.id, req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};