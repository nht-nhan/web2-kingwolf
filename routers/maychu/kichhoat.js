const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const email = require('../../models/mail');
const khachhang = require('../../models/khachhang');
const taikhoan = require('../../models/taikhoan');
const router = new Router();
//===[Kích hoạt]===//
router.get('/:token', asyncHandler(async function(req, res) {
    const token = req.params.token;
    const KH = await khachhang.find_one_token(token);
    const kichhoat = await khachhang.save_kichhoat_email(KH);
    const matkhau = crypto.randomBytes(5).toString('hex').toUpperCase();
    const save_matkhau = await khachhang.save_matkhau(KH, matkhau);
    const gui_mail_matkhau = await email.sendpw(KH.email, "KingWolf Bank gửi mật khẩu cho bạn", KH.hoten, matkhau);
    try {
        if (KH) {
            if (kichhoat) {
                if (save_matkhau) {
                    if (gui_mail_matkhau) {
                        while (true) {
                            const stk_1 = taikhoan.getRandomInt(1000, 9999)
                            const stk_2 = taikhoan.getRandomInt(1000, 9999)
                            const stk = "2020" + "" + stk_1 + "" + stk_2;
                            const checkstk = await taikhoan.count_stk(stk)
                            if (checkstk.count == 0) {
                                const tao_taikhoan = await taikhoan.create_taikhoan(stk, 0, "VND", 0, false, false, KH.id);
                                if (tao_taikhoan) {
                                    req.app.set('type', '1');
                                    res.redirect('/kichhoat');
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.log("Thông báo lỗi: ", error);
        return res.status(500).render('maychu/500');
    }


}))

router.get('/', asyncHandler(async function index(req, res) {
    res.render('maychu/kichhoat', { type: req.app.get('type') });
    req.app.set('type', null);
}))

module.exports = router;