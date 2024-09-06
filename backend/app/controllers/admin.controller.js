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


const ApiError = require("../api-error");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const bcrypt = require("bcrypt");

const convertToDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`; // JavaScript sử dụng tháng từ 0-11
}
const convertToDateReverse = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}

exports.createStaff = async (req, res, next) => {
    const staff = new Staffs();
    const newStaff = req.body;
    console.log(newStaff)
    console.log(req.body)
    salt = await bcrypt.genSalt(10);
    newStaff.matKhau_NV = await bcrypt.hash(newStaff.matKhau_NV, salt);
    try {
        const result = await staff.create(newStaff);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateStaff = async (req, res, next) => {
    const staff = new Staffs();
    try {
        const result = await staff.update(req.params.id, req.body);
        res.status(201).json(result);
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
                { expiresIn: "1d" }
            );
            // refresh
            const refreshToken = jwt.sign(
                {
                    id: result.id,
                    role: result.role
                },  
                process.env.JWT_REFRESH_TOKEN,
                { expiresIn: "30d" }
            );

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                path: "/",
                sameSite: "strict",
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
                role: result.chuc_vu
            },  
            process.env.JWT_ACCESS_TOKEN,
            { expiresIn: "3d" }
        );
        // refresh
        const newRefreshToken = jwt.sign(
            {
                id: user.id,
                role: result.chuc_vu
            },  
            process.env.JWT_REFRESH_TOKEN,
            { expiresIn: "30d" }
        );

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            path: "/",
            sameSite: "strict",
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
        const listBooking = await booking.findBookingBooked(time);
        let result = listField;
        
        if(listBooking)
            result = result.filter(field => {
                return listBooking.some(element => field._id.toString() === element.san._id.toString());
            });
        
                // return listBooking.some((booking) => {
                //     const bookingDate = convertToDate(booking.ngayDat);
                //     // const bookingDate = convertToDate(booking.ngayDat);
                //     const isSameDate = bookingDate === time.ngayDat;
                //     const isSameField = booking.san._id.toString() === field._id.toString();

                //     const startTime = time.thoiGianBatDau ? time.thoiGianBatDau : '00:00';
                //     const endTime = time.thoiGianKetThuc ? time.thoiGianKetThuc : '23:59';
                //     const bookingStart = booking.thoiGianBatDau;
                //     const bookingEnd = booking.thoiGianKetThuc;
                //     // Lọc theo thời gian nếu có thời gian bắt đầu và kết thúc
                //     if (time.thoiGianBatDau || time.thoiGianKetThuc) {
                //         return isSameField &&
                //         isSameDate &&
                //         (
                //             (startTime <= bookingEnd && endTime >= bookingStart) // Kiểm tra chồng lấn thời gian
                //         );
                //     } else {
                //         // Lọc chỉ theo ngày nếu không có thời gian
                //         return isSameField &&
                //         isSameDate;
                //     }
                // });
            // });
        // }
        // console.log(result);
        res.status(201).json(result);
    } catch (err) {
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
    try {
        const data = req.body;
        const {san, ...other} = data;
        let count = 0;
        // Xử lý sân
        for (const element of san) {
            const { thoiGianBatDau, thoiGianKetThuc, ngayDat, thanhTien, hinhAnh_San, ...otherTwo } = element;
            const newData = {
                ...other,           
                san: otherTwo,      
                thoiGianBatDau,     
                thoiGianKetThuc,
                ngayDat: convertToDateReverse(ngayDat),
                thanhTien,
            }; 
            if (await booking.create(newData)) {
                count++;
            }
        }
        res.status(201).json({ success: true, count});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.updateBooking = async (req, res, next) => {
    const booking = new Bookings();
    try {
        const result = await booking.update(req.params.id, req.body);
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
    const newUserMembership = req.body;
    try {
        const result = await userMembership.create(newUserMembership);
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
    try {
        const result = await userMembership.findAll();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findOneUserMembership = async (req, res, next) => {
    const userMembership = new UserMemberships();
    try {
        let result;
        if(!req.params.id) 
            result = await userMembership.findOne(req.body)
        else 
            result = await userMembership.findById(req.params.id) 
        res.status(201).json(result);
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