const { Router } = require('express');
const khachhang = require('../../models/khachhang');
const outlogin = require('../../middlewares/khachhang/outlogin');
const email = require('../../models/mail');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const router = new Router();

//-------------------[Quên Mật Khẩu]-------------------//
router.use(outlogin);
   //=========[BEGIN: GET]=========//
    router.get('/', asyncHandler(async function(req, res) 
    {
        console.log("Loại error/success: ", req.app.get('forgetpwerr'));
        res.render('maychu/quenmatkhau', { typeerr: req.app.get('forgetpwerr') });
        req.app.set('forgetpwerr', null);
    }));
   //=========[END: GET]=========//
   //=========[BEGIN: GET:token]=========//
    router.get('/:token', asyncHandler(async function(req, res) {
        const token = req.params.token;
        const KH = await khachhang.find_one_token_pw(token);
        if (KH) {
            const hastsdt = crypto.randomBytes(4).toString('hex').toUpperCase();
            const active = await khachhang.save_token_quenmatkhau(KH,hastsdt);
            if (active) {
                res.redirect(`newpw/${hastsdt}`);
            }
        }
    }));
   //=========[END: GET:token]=========//
   //=========[BEGIN: POST]=========//
    router.post('/', asyncHandler(async function(req, res) {
        const emails = req.body.kw_email;
        const checkemail = await khachhang.find_one_email(emails);
        const token = crypto.randomBytes(3).toString('hex').toUpperCase();
        try {
            if (checkemail) {
                const savetoken = await khachhang.save_token_quenmatkhau(checkemail, token);
                if (savetoken) {
                    await email.forgetpw(checkemail.email, "KingWolf Bank gửi link reset mật khẩu", checkemail.hoten, token)
                    res.render('maychu/quenmatkhau', { typeerr: 3 })
                }
            }
        } catch (error) {
            console.log("Thông báo lỗi :", error);
            res.redirect('/500');
        }
    }));
   //=========[END: POST]=========//
   //=========[BEGIN: GET:sdt]=========//
    router.get('/newpw/:sdt', asyncHandler(async function(req, res) {
        const sdt = req.params.sdt;
        const KH = await khachhang.find_one_token_pw(sdt);
        if(KH) 
        {
            const thongbao = null;
            res.render('maychu/newpw', { thongbao });
        } 
        else 
        {
            req.app.set('forgetpwerr', '1');
            res.redirect('/quenmatkhau');
        }
    }));
   //=========[END: GET:sdt]=========//
   //=========[BEGIN: POST:sdt]=========//
    router.post('/newpw/:sdt', asyncHandler(async function(req, res) {
        const sdt = req.params.sdt;
        const KH = await khachhang.find_one_token_pw(sdt);
        const pw1 = req.body.kw_password_1;
        const pw2 = req.body.kw_password_2;
        if (KH) {
            if (pw1 == pw2) {
                const checksavepw = await khachhang.save_mat_khau(KH, pw1);
                if (checksavepw) {
                    const savetoken = await khachhang.save_kh_quenmatkhau(KH);
                    if (savetoken) {
                        req.app.set('forgetpwerr', '3');
                        res.redirect('/quenmatkhau');
                    }
                }
            } else {
                const loi = "Xác nhận mật khẩu không chính xác";
                res.render('maychu/newpw', { thongbao: loi });
            }
        } else {
            req.app.set('forgetpwerr', '1');
            res.redirect('/quenmatkhau');
        }
    }));
   //=========[END: POST:sdt]=========//
//-------------------[Quên Mật Khẩu]-------------------//

module.exports=router
