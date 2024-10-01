const Users = require("../services/user.service");
const Bookings = require("../services/booking.service");
const Invoices = require("../services/invoice.service");
const { UserMemberships } = require("../services/membership.service");
const { UserEvents } = require("../services/event.service");
const Reviews = require("../services/review.service");
const Carts = require("../services/cart.service"); 
const Contacts = require("../services/contact.service"); 

const ApiError = require("../api-error");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const bcrypt = require("bcrypt");


const convertToDateReverse = (dateStr) => {
    if (dateStr.includes("-")) {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    }
    return dateStr;
}

exports.create = async (req, res, next) => {
    const users = new Users();
    const newUser = req.body;
    try {
        salt = await bcrypt.genSalt(10);
        newUser.matKhau_KH = await bcrypt.hash(newUser.matKhau_KH, salt);
        const result = await users.create(newUser);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res, next) => {
    const users = new Users();
    try {
        const newUpdate = req.body;
        if(newUpdate.matKhauCu) {
            let oldPass = newUpdate.matKhauCu;
            const user = await users.findById(req.params.id);
            const validPassword = await bcrypt.compare(
                oldPass,
                user.matKhau_KH
            )
            console.log(validPassword)
            if(validPassword) {
                salt = await bcrypt.genSalt(10);
                newUpdate.matKhau_KH = await bcrypt.hash(newUpdate.matKhauMoi, salt);
            }
            else {
                return res.status(401).json({ error: 'Sai mật khẩu'});             
            }
        }
        const result = await users.update(req.params.id, newUpdate);
        const { matKhau_KH, ...others } = result._doc;
        res.status(201).json(others);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res, next) => {
    const users = new Users();
    try {
        const result = await users.findOne({"sdt_KH": req.body.sdt_KH});
        if(!result) {
            return next(
                new ApiError(404, "Số điện thoại không hợp lệ!")
            );
        }
        const validPassword = await bcrypt.compare(
            req.body.matKhau_KH,
            result.matKhau_KH
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
                    // role: result.role
                },  
                process.env.JWT_ACCESS_TOKEN,
                { expiresIn: "1d" }
            );
            // refresh
            const refreshToken = jwt.sign(
                {
                    id: result.id,
                    // role: result.role
                },  
                process.env.JWT_REFRESH_TOKEN,
                { expiresIn: "30d" }
            );

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                path: "/",
                sameSite: "strict",
            });


            const {matKhau_KH, ...others} = result._doc;
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
                // role: result.role
            },  
            process.env.JWT_ACCESS_TOKEN,
            { expiresIn: "1d" }
        );
        // refresh
        const newRefreshToken = jwt.sign(
            {
                id: user.id,
                // role: result.role
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

exports.findAll = async (req, res, next) => {
    const users = new Users();
    try {
        const result = await users.findAll();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findOne = async (req, res, next) => {
    const users = new Users();
    try {
        const result = await users.findById(req.params.id);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteOne = async (req, res, next) => {
    const users = new Users();
    try {
        const result = await users.delete(req.params.id);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Đặt sân
exports.createBooking = async (req, res, next) => {
    const booking = new Bookings();
    try {
        const newBooking = req.body;
        newBooking.ngayDat = convertToDateReverse(newBooking.ngayDat)
        const result = await booking.create(newBooking);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.updateBooking = async (req, res, next) => {
    const booking = new Bookings();
    try {
        const result = await booking.update(req.params.id, req.body);
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
exports.findAllBookingUser = async (req, res, next) => {
    const booking = new Bookings();
    try {
        console.log(req.query)
        const result = await booking.findAllBookingUser(req.query.id);
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
        const result = await userMembership.findAllUser(req.body.id);
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
        const result = await userEvent.findAllUser(req.body.id);
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
        const result = await review.findAllUser(req.body.id);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findOneReview = async (req, res, next) => {
    const review = new Reviews();
    console.log(req.body)
    try {
        let result;
        if(!req.params.id) {
            result = await review.findOne(req.body)
        }
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

// Giỏ hàng
exports.createCart = async (req, res, next) => {
    const cart = new Carts();
    const newCart = req.body;
    try {
        const result = await cart.create(newCart);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCart = async (req, res, next) => {
    const cart = new Carts();
    try {
        const result = await cart.update(req.params.id, req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findAllCart = async (req, res, next) => {
    const cart = new Carts();
    try {
        const result = await cart.findAllUser(req.body.id);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findOneCart = async (req, res, next) => {
    const cart = new Carts();
    try {
        let result;
        if(!req.params.id) 
            result = await cart.findOne(req.body)
        else 
            result = await cart.findById(req.params.id) 
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteOneCart = async (req, res, next) => {
    const cart = new Carts();
    try {
        const result = await cart.delete(req.params.id);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Hóa đơn
exports.findAllInvoiceUser = async (req, res, next) => {
    const invoice = new Invoices();
    try {
        const result = await invoice.finAllInvoiceUser(req.params.id)
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Liên hệ
// Đánh giá
exports.createContact = async (req, res, next) => {
    const review = new Contacts();
    const newReview = req.body;
    try {
        const result = await review.create(newReview);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.findAllContact = async (req, res, next) => {
    const review = new Contacts();
    try {
        const result = await review.findAllUser(req.body.id);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

