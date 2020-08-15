const { Router } = require('express');
const khachhang = require('../../models/khachhang');
const outlogin = require('../../middlewares/khachhang/outlogin');
const asyncHandler = require('express-async-handler');
const router = new Router();
//-------------------[Đăng Nhập]-------------------//
router.use(outlogin);
   //=========[BEGIN: GET]=========//
    router.get('/', asyncHandler(async function(req, res) {
        const thongbao = null;
        res.render('maychu/dangnhap', { thongbao });
    }));
   //=========[END: GET]=========//
   //=========[BEGIN: GET:Tìm Kiếm]=========//
    router.get('/:timkiem', asyncHandler(async function(req, res) {
        try {
            res.redirect('/404');
        } catch (error) {
            console.log("Thông báo lỗi :", error);
            res.status(500);
        }
    }));
   //=========[END: GET:Tìm Kiếm]=========//
   //=========[BEGIN: POST]=========//
   router.post('/', asyncHandler(async function(req, res) {
    const thongbao = [];
    const emails = req.body.kw_email;
    const pw = req.body.kw_password;
    const KH = await khachhang.find_one_email(emails);
    try {
        if (KH) {
            const checktoken = KH.tokenkichhoat;
            if (checktoken === null) {
                const checkpw =  khachhang.verifypw(pw, KH.matkhau);
                if (checkpw) {
                    req.session.khachhangId = KH.id;
                    return res.redirect('/khachhang');
                } else {
                    const loi = "Mật khẩu của bạn bị sai ";
                    thongbao.push(loi);
                    res.render('maychu/dangnhap', { thongbao });
                }
            } else {
                const loi = "Email của bạn chưa kích hoạt . Kiểm tra lại hộp thư Email";
                thongbao.push(loi);
                res.render('maychu/dangnhap', { thongbao });
            }
        } else {
            const loi = "Email của bạn không tồn tại trên hệ thống";
            thongbao.push(loi);
            res.render('maychu/dangnhap', { thongbao });
        }
    } catch (error) {
        console.log("Thông báo lỗi :", error);
        res.status(500);
    }
}));
   //=========[END: POST]=========//
//-------------------[Đăng Nhập]-------------------//
module.exports=router
