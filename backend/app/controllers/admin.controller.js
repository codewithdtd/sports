const Staffs = require("../services/staff.service");
const Facilities = require("../services/facility.service");
const Bookings = require("../services/booking.service");


const ApiError = require("../api-error");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const bcrypt = require("bcrypt");

exports.createStaff = async (req, res, next) => {
    const staff = new Staffs();
    const newStaff = req.body;
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
                { expiresIn: "300s" }
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
            { expiresIn: "300s" }
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
        const result = await booking.create(req.body);
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

