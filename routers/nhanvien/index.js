const { Router } = require('express');
const nhanvien = require('../../models/nhanvien');
const outlogin = require('../../middlewares/nhanvien/outlogin');
const asyncHandler = require('express-async-handler');
const router = new Router();
//-------------------[Đăng nhập nhân viên]-------------------//
//router.use(outlogin);
   //=========[BEGIN: GET]=========//
    router.get('/', asyncHandler(async function(req, res) {
        const thongbao = null;
        res.render('nhanvien/index', { thongbao });
    }));
   //=========[END: GET]=========//
   //=========[BEGIN: POST]=========//
    router.post('/', asyncHandler(async function(req, res) {
        const thongbao = [];
        const username = req.body.kw_username;
        const pw = req.body.kw_password;
        const Nhanvien = await nhanvien.findbyname(username)
        try {
            if (Nhanvien) 
            {
                const checkpw = nhanvien.verifypw(pw, Nhanvien.matkhau);
                if (checkpw) 
                {
                    req.session.nvId = Nhanvien.id;
                    return res.redirect('/nhanvien/danhsach'); 
                } 
                else {
                    const loi = "Mật khẩu của bạn bị sai ";
                    thongbao.push(loi);
                    res.render('nhanvien/index', { thongbao });
                }
            } 
            else {
                const loi = "Tài khoản của bạn không tồn tại trên hệ thống";
                thongbao.push(loi);
                res.render('nhanvien/index', { thongbao });
            }
        } catch (error) {
            console.log("Thông báo lỗi :", error);
            res.redirect('/500');
        }
    }));
   //=========[END: POST]=========//
//-------------------[Đăng nhập nhân viên]-------------------//
module.exports=router;