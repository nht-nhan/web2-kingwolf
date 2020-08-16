const { Router } = require('express');
const khachhang = require('../../models/khachhang');
const crypto = require('crypto');
const email = require('../../models/mail');
const taikhoan = require('../../models/taikhoan');
const Sequelize = require('sequelize');
const OP = Sequelize.Op;
const asyncHandler = require('express-async-handler');
const router = new Router();

//-------------------[Kích Hoạt Email]-------------------//
   //=========[BEGIN: GET:Token]=========//
   router.get('/:token', asyncHandler(async function(req, res) {
       const token = req.params.token;
       const KH = await khachhang.find_one_token(token);
       const kichhoat = await khachhang.save_kh_email(KH);
       const matkhau = crypto.randomBytes(5).toString('hex').toUpperCase();
       const save_matkhau= await khachhang.save_mat_khau(KH,matkhau);
       const gui_email_pw = await email.sendpw(KH.email,"KingWolf Bank gửi mật khẩu cho bạn",KH.hoten,matkhau)
       try {
           if(KH)
           {
               if(kichhoat)
               {
                   if(save_matkhau)
                   {
                       if(gui_email_pw)
                       {
                           while(true)
                           {
                                const rdstk = taikhoan.getRandomInt(1000, 5000);
                                const sait = taikhoan.getRandomInt(1000, 9999);
                                const stk = "2020" + "" + rdstk + "" + sait;
                                const checkstk = taikhoan.findAll({
                                    where: {
                                        sotaikhoan: {
                                            [OP.ne]: stk
                                        }
                                    }
                                });
                                if (checkstk) {
                                    const createtaikhoan = await taikhoan.create_TK(stk,0, 0, "VNĐ", false, false, KH.id);
                                    if (createtaikhoan) {
                                        req.app.set('type', '1');
                                        res.redirect('/kichhoat');
                                        break;
                                    }
                                }
                            }
                       }
                   }
               }
               else
               {
                    req.app.set('type', '2');
                    res.redirect('/kichhoat');
               }
           }
       } catch (error) {
           console.log("Thông báo lỗi: ",error);
           res.status(500);
       }
   }))
   //=========[END: GET:Token]=========//
   //=========[BEGIN: GET]=========//
    router.get('/', asyncHandler(async function index(req, res) {
        res.render('maychu/kichhoat', { type: req.app.get('type') });
        req.app.set('type', null);
    }))
   //=========[END: GET]=========//
//-------------------[Kích Hoạt Email]-------------------//
module.exports=router;
