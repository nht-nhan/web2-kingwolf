const { Router } = require('express');
const khachhang = require('../../models/khachhang');
const crypto = require('crypto');
const mail = require('../../models/mail');
const asyncHandler = require('express-async-handler');
const router = new Router();
//===[Đăng ký]===//
router.get('/', asyncHandler(async function(req, res) {
    const thongbao = null;
    return res.render('maychu/dangky', { thongbao });
}))
router.post('/', asyncHandler(async function(req, res) {
    try {
        const thongbao = []
        const hotens = req.body.kw_hoten;
        const emails = req.body.kw_email;
        const ngaysinhs = req.body.kw_ngaysinh;
        const sdts = req.body.kw_sodienthoai;
        const checkemail = await khachhang.count_email(emails);
        const checksdt = await khachhang.count_sdt(sdts);
        if (checkemail.count != 0 && checksdt.count != 0) {
            const loi = { type: 0, nd: "Email và số điện thoại đã tồn tại !" };
            thongbao.push(loi);
            return res.render('maychu/dangky', { thongbao });
        }
        if (checkemail.count != 0) {
            const loi = { type: 1, nd: "Địa chỉ email của bạn đã tồn tại !" };
            thongbao.push(loi);
        }
        if (checksdt.count != 0) {
            const loi = { type: 2, nd: "Số điện thoại của bạn đã tồn tại !" };
            thongbao.push(loi);
        }
        if (thongbao.length > 0) {
            return res.render('maychu/dangky', { thongbao });
        } else {
            const token = crypto.randomBytes(3).toString('hex').toUpperCase();
            const ngaytao = new Date();
            const checkcreate = khachhang.create_kh(emails, hotens, sdts, ngaysinhs, token);
            if (checkcreate) {
                const checkguimail = await mail.send(emails, "KingWolf Bank kích hoạt tài khoản email", token);
                if (checkguimail) {
                    const ko_loi = { type: 3, nd: "Chúc mừng bạn đã đăng ký thành công. Kiểm tra email để kích hoạt" };
                    thongbao.push(ko_loi);
                    return res.render('maychu/dangky', { thongbao })
                } else {
                    console.log("Tài khoản và mật khẩu có thể bị sai á ");
                    return res.status(500).render('maychu/500');
                }
            }
        }
    } catch (error) {
        console.log("Thông báo lỗi: ", error);
        return res.status(500).render('maychu/500');
    }
}))
module.exports = router;