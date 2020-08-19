const { Router } = require('express');
const khachhang = require('../../models/khachhang');
const email = require('../../models/mail');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const router = new Router();
//===[Quên mật khẩu]===//
router.post('/', asyncHandler(async function(req, res) {
    const emails = req.body.kw_email;
    const checkemail = await khachhang.find_one_email(emails);
    const token = crypto.randomBytes(3).toString('hex').toUpperCase();
    try {
        if (checkemail) {
            const savetoken = await khachhang.save_token_quenmatkhau(checkemail, token);
            if (savetoken) {
                await email.forgetpw(checkemail.email, "KingWolf Bank gửi link reset mật khẩu", checkemail.hoten, token)
                return res.render('maychu/quenmatkhau', { typeerr: 3 })
            }
        }
    } catch (error) {
        console.log("Thông báo lỗi :", error);
        res.redirect('/500');
    }
}));
//------//
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
    else
        {
            return res.render('maychu/quenmatkhau', { typeerr: 4 })
        }
}));
//------//
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
        return res.render('maychu/quenmatkhau', { typeerr: 4 })
    }
}));
//------//
router.post('/newpw/:sdt', asyncHandler(async function(req, res) {
    const sdt = req.params.sdt;
    const KH = await khachhang.find_one_token_pw(sdt);
    const pw1 = req.body.kw_password_1;
    const pw2 = req.body.kw_password_2;
    if (KH) {
        if (pw1 == pw2) {
            const checksavepw = await khachhang.save_matkhau(KH, pw1);
            if (checksavepw) {
                const savetoken = await khachhang.save_kichhoat_quenmatkhau(KH);
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
        req.app.set('forgetpwerr', '4');
        res.redirect('/quenmatkhau');
    }
}));
//------//
router.get('/', asyncHandler(async function(req, res) 
{
    console.log("Loại error/success: ", req.app.get('forgetpwerr'));
    res.render('maychu/quenmatkhau', { typeerr: req.app.get('forgetpwerr') });
    req.app.set('forgetpwerr', null);
}));
module.exports=router;
