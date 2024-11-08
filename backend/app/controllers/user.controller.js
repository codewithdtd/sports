const Users = require("../services/user.service");
const Bookings = require("../services/booking.service");
const Services = require("../services/service.service");
const Invoices = require("../services/invoice.service");
const { UserMemberships } = require("../services/membership.service");
const { UserEvents } = require("../services/event.service");
const Reviews = require("../services/review.service");
const Carts = require("../services/cart.service"); 
const Contacts = require("../services/contact.service"); 
// const axios = require("axios");
const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const moment = require('moment'); // npm install moment

const admin = require("../controllers/admin.controller");
const ApiError = require("../api-error");
const jwt = require("jsonwebtoken");
const cron = require('node-cron');
require('dotenv').config();
const bcrypt = require("bcrypt");
const bodyParser = require('body-parser');
const qs = require('qs');
const fs = require('fs');
const path = require('path');
const nodemailer = require("nodemailer");
const express = require('express');
const app = express();
app.use(bodyParser.json());

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
    salt = await bcrypt.genSalt(10);
    newUser.matKhau_KH = await bcrypt.hash(newUser.matKhau_KH, salt);
    try {
        const exits = await users.findOne({sdt_KH: newUser.sdt_KH})
        if(exits) {
            res.status(409).json({error: 'Tài khoản đã được đăng ký!!!'})
        }
        else {
            const result = await users.create(newUser);
            res.status(201).json(result);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res, next) => {
    const users = new Users();
    try {
        const newUpdate = req.body;
        const oldUser = await users.findById(req.params.id);
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

        let hinhAnhDaiDien = null;
        if (req.file) {
            if(oldUser.hinhAnh_KH) {
                const oldImagePath = path.join(__dirname, '../uploads/', oldUser.hinhAnh_KH);
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
            hinhAnhDaiDien = req.file.filename;
            newUpdate.hinhAnh_KH = hinhAnhDaiDien;
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
                maxAge: 7 * 24 * 60 * 60 * 1000,
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
    console.log('refresh')
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
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
            maxAge: 7 * 24 * 60 * 60 * 1000,
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
    const service = new Services();
    try {
        const newBooking = req.body;
        const newDichVu = newBooking.dichVu || [];

        newBooking.ngayDat = convertToDateReverse(newBooking.ngayDat)
        for(let newService of newDichVu) {
            let temp = await service.findById(newService._id)

            const r = await service.update(newService._id, { tonKho: temp._doc.tonKho - newService.soluong });
        }
        const result = await booking.create(newBooking);
        if(!result.maGiaoDich) {
            const email = await axios.post("http://localhost:3000/api/user/email", result);
        }
        res.status(201).json(result);
    } catch (err) {
        console.log(err.message);
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

exports.findOneInvoiceUser = async (req, res, next) => {
    const invoice = new Invoices();
    try {
        const result = await invoice.findOne({"datSan._id": req.params.id})
        res.status(201).json(result);
    } catch (err) {
        console.log(err.message);
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

// exports.payment = async (req, res, next) => {
//     //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
//     //parameters
//     var accessKey = 'F8BBA842ECF85';
//     var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
//     var orderInfo = 'pay with MoMo';
//     var partnerCode = 'MOMO';
//     var redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
//     var ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
//     var requestType = "payWithMethod";
//     var amount = '1000';
//     var orderId = partnerCode + new Date().getTime();
//     var requestId = orderId;
//     var extraData ='';
//     var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
//     var orderGroupId ='';
//     var autoCapture =true;
//     var lang = 'vi';

//     //before sign HMAC SHA256 with format
//     //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
//     var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
//     //puts raw signature
//     console.log("--------------------RAW SIGNATURE----------------")
//     console.log(rawSignature)
//     //signature
//     const crypto = require('crypto');
//     var signature = crypto.createHmac('sha256', secretKey)
//         .update(rawSignature)
//         .digest('hex');
//     console.log("--------------------SIGNATURE----------------")
//     console.log(signature)

//     //json object send to MoMo endpoint
//     const requestBody = JSON.stringify({
//         partnerCode : partnerCode,
//         partnerName : "Test",
//         storeId : "MomoTestStore",
//         requestId : requestId,
//         amount : amount,
//         orderId : orderId,
//         orderInfo : orderInfo,
//         redirectUrl : redirectUrl,
//         ipnUrl : ipnUrl,
//         lang : lang,
//         requestType: requestType,
//         autoCapture: autoCapture,
//         extraData : extraData,
//         orderGroupId: orderGroupId,
//         signature : signature
//     });
    
//     const options = {
//         method: "POST",
//         url: "https://test-payment.momo.vn/v2/gateway/api/create",
//         headers: {
//             'Content-Type': 'application/json',
//             'Content-Length': Buffer.byteLength(requestBody)
//         },
//         data: requestBody
//     }

//     let result;
//     try {
//         result = await axios(options);
//         return res.status(200).json(result.data);
//     } catch (error) {
//         return res.status(500).json({
//             statusCode: 500,
//             message: error,
//         })
//     }
// }

const config = {
    app_id: "2554",
    key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
    key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create",
    refund_url: "https://sb-openapi.zalopay.vn/v2/refund"
};



exports.payment = async (req, res, next) => {
    const { userId, thanhTien } = req.body;
    // const khachHangId = khachHang._id;   
    const config = {
        app_id: "2554",
        key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
        key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
        endpoint: "https://sb-openapi.zalopay.vn/v2/create"
    };

    const embed_data = {
        redirecturl: "http://localhost:5001/",
    };

    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
        app_user: userId,
        app_time: Date.now(), // miliseconds
        expire_duration_seconds: 300,
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: thanhTien,
        description: `DSport - Payment for the order #${transID}`,
        bank_code: "",
        callback_url: 'https://f986-14-241-183-210.ngrok-free.app/api/user/callback'
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const result = await axios.post(config.endpoint, null, { params: order })
        // console.log(result.data)
        res.status(200).json({ app_trans_id: `${moment().format('YYMMDD')}_${transID}`, ...result.data})
    } catch (error) {
        console.log(error.message)
        res.status(500).json(error.message)
    }
}

exports.callback = async (req, res, next) =>  {
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);


    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      let dataJson = JSON.parse(dataStr, config.key2);
      const booking = new Bookings();
      const bookings = await booking.find({maGiaoDich: dataJson["app_trans_id"]});
    
      for(let item of bookings) {
        await booking.delete(item._id);
      }
      result.return_code = -1;
      result.return_message = "mac not equal";
    }
    else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, config.key2);
      console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);
      const booking = new Bookings();
      const bookings = await booking.find({maGiaoDich: dataJson["app_trans_id"]});
      console.log(bookings.length);
      for(let item of bookings) {
        const update = await booking.update(item._id, {expireAt: null, trangThaiThanhToan: 'Đã thanh toán', order_url: '', zp_trans_id: dataJson["zp_trans_id"]});
        const email = await axios.post("http://localhost:3000/api/user/email", update);
      }
      console.log('Đã update')
      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
};

exports.paymentStatus = async (req, res, next) => {
    const app_trans_id = req.params.app_trans_id;
    let postData = {
        app_id: config.app_id,
        app_trans_id: app_trans_id, // Input your app_trans_id
    }

    let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();


    let postConfig = {
        method: 'post',
        url:  "https://sb-openapi.zalopay.vn/v2/query",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(postData)
    };

    try {
        const result = await axios(postConfig);
        return res.status(200).json(result.data)
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message)
    }
}

exports.refund = async (req, res, next) => {
    let {thanhTien, zp_trans_id, maGiaoDich, _id} = req.body;
    const config = {
        app_id: "2554",
        key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
        key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
        refund_url: "https://sb-openapi.zalopay.vn/v2/refund"
    };
    const timestamp = Date.now();
    const uid = `${timestamp}${Math.floor(111 + Math.random() * 999)}`;

    let params = {
        app_id: config.app_id,
        m_refund_id: `${moment().format('YYMMDD')}_${config.app_id}_${uid}`,
        timestamp, // miliseconds
        zp_trans_id: zp_trans_id,
        amount: thanhTien,
        description: 'ZaloPay Refund Demo',
    };

    let data = `${params.app_id}|${params.zp_trans_id}|${params.amount}|${params.description}|${params.timestamp}`;
    params.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const result = await axios.post(config.refund_url, new URLSearchParams(params).toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return res.status(200).json(result.data)
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message)
    }
}

// Chạy mỗi phút để kiểm tra các booking chưa thanh toán
cron.schedule('* * * * *', async () => {
    const expiredTime = new Date(Date.now() -  5 * 60 * 1000); // Lấy thời gian 5 phút trước
    try {
        const booking = new Bookings();
        const result = await booking.updateMany(
            {
                trangThaiThanhToan: 'Chưa thanh toán',  // Chỉ cập nhật các booking chưa thanh toán
                expireAt: { $lt: expiredTime }           // Quá 5 phút kể từ khi tạo
            },
            { $set: { trangThai: 'Đã hủy' } }  // Chuyển trạng thái thành "Đã hủy"
        );
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái booking:', error);
    }
});


exports.sendEmail = async (req, res, next) => {
    try {
        const booking = req.body;
        console.log(req.body.thanhTien);
        const email = booking.khachHang?.email_KH; 
        if(email) {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
            
            const info = await transporter.sendMail({
                from: '"DSport - Sân thể thao" <dsportfield@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "Xác nhận đặt sân", // Subject line
                text: "Hello world?", // plain text body
                html: `
                    <div style="font-family: Arial, sans-serif;">
                        <div style="background-color: #bde4ff;text-align: center; padding: 30px;font-family: Arial, sans-serif;">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeFFowlHN27HxNRl7SeNWVDC3F3dLq02QyaQ&s" alt="" />
                            <h1 class="title" style="font-size: 30px;color: #1782cc">Thank you!</h1>
                        </div>  
                        <div style="text-align:center; width: 70%; margin: auto;">
                            <h2 style="text-align:center">Thông tin đặt sân của bạn</h2>  
                            <div style="display: flex; margin:auto ;justify-content:space-around;">
                                <p style="padding: 8px; ">Tên khách hàng:</p>
                                <p style="padding: 8px;font-style:italic;">${booking.khachHang.ho_KH + ' ' + booking.khachHang.ten_KH}</p>
                            </div>
                            <div style="display: flex; margin:auto ;justify-content:space-around;">
                                <p style="padding: 8px; ">Tổng giá tiền:</p>
                                <p style="padding: 8px; font-style:italic; font-weight: bold;">${booking.thanhTien}</p>
                            </div>
                            <div style="display: flex; margin:auto ;justify-content:space-around;">
                                <p style="padding: 8px; ">Thời gian đặt sân:</p>
                                <p style="padding: 8px; font-style:italic;">${booking.ngayTao}</p>
                            </div>
                            <div style="display: flex; margin:auto ;justify-content:space-around;">
                                <p style="padding: 8px;">Trạng thái thanh toán:</p>
                                <p style="padding: 8px; font-weight: bold; font-style:italic;">${booking.trangThaiThanhToan}</p>
                            </div>
                            <table style="width: 100%;margin: auto;border-collapse: collapse; font-family: Arial, sans-serif;">
                                <tr>
                                    <td style="padding: 8px; border: 1px solid;">${booking.san.ten_San + ' - ' +booking.san.ma_San}</td>
                                    <td style="padding: 8px; border: 1px solid;text-align: center;">
                                        ${booking.ngayDat}
                                        <br>
                                        ${booking.thoiGianBatDau + ' - ' + booking.thoiGianKetThuc}
                                    </td>
                                    <td style="padding: 8px; border: 1px solid;">${booking.san.bangGiaMoiGio}</td>
                                </tr>
                                ${booking.dichVu?.map((item) => {
                                    return `<tr>
                                        <td style="padding: 8px; border: 1px solid;">${item.ten_DV}</td>
                                        <td style="padding: 8px; border: 1px solid;text-align: center;">${item.soluong}</td>
                                        <td style="padding: 8px; border: 1px solid;">${item.thanhTien}</td>
                                    </tr>`
                                    }
                                )}
                            </table>
                            <p>
                                Cảm ơn quý khách đã tin tưởng sử dụng dịch vụ của Dsport.
                            </p>
                            <p>
                                Nếu có sai sót hay thắc mắc khi đặt sân vui lòng liên hệ tới hotline để được hổ trợ nhanh nhất.
                            </p>
                            <p>
                                Dsport chúc quý khách có nhiều sức khỏe.
                            </p>
                        </div>
                    </div>
                `, // html body
            });

            res.status(200).json(info);
        }
    } catch (error) {
        res.status(500).json(error);
    }
} 