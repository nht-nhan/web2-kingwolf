const { Router } = require('express');
const khachhang= require('../../models/khachhang');
const outlogin = require('../../middlewares/khachhang/outlogin');
const crypto = require('crypto');
const mail = require('../../models/mail');
const asyncHandler = require('express-async-handler');
const router = new Router();
//-------------------[Đăng Ký]-------------------//
router.use(outlogin);
   //=========[BEGIN: GET]=========//
      router.get('/', asyncHandler(async function(req, res){
         const thongbao=null;
         res.render('maychu/dangky',{thongbao});
      }))
   //=========[END: GET]=========//
   //=========[BEGIN: POST]=========//
   router.post('/', asyncHandler(async function(req, res) {
      try {
         const thongbao=[]
         const hotens=req.body.kw_hoten;
         const emails = req.body.kw_email;
         const ngaysinhs = req.body.kw_ngaysinh;
         const sdts = req.body.kw_sodienthoai;
         const checkemail = await khachhang.count_email(emails);
         const checksdt = await khachhang.count_sdt(sdts);
         if(checkemail.count != 0)
         {
            const loi = {type:1,nd:"Địa chỉ email của bạn đã tồn tại !"};
            thongbao.push(loi);
         }
         if(checksdt.count !=0)
         {
            const loi = {type:1,nd:"Địa chỉ email của bạn đã tồn tại !"};
            thongbao.push(loi);
         }
         if(thongbao.length>0)
         {
            res.render('maychu/dangky',{thongbao});
         }
         else
         {
            const token = crypto.randomBytes(3).toString('hex').toUpperCase();
            const ngaytao=new Date();
            const checkcreate = khachhang.create_KH(emails,hotens,sdts,ngaysinhs,ngaytao,token);
            if(checkcreate)
            {
               const checkguimail = await mail.send(emails,"KingWolf Bank kích hoạt tài khoản email",token);
               if(checkguimail)
               {
                  const ko_loi = {type:2,nd:"KingWolf Bank thông báo"};
                  thongbao.push(ko_loi);
                  res.render('maychu/dangky',{thongbao})
               }
               else
               {
                  console.log("Tài khoản và mật khẩu có thể bị sai á ");
               }
            }
         }
      } catch (error) {
         console.log("Thông báo lỗi: ",error);
         res.status(500);
      }
   }))
   //=========[END: POST]=========//
//-------------------[Đăng Ký]-------------------//
module.exports=router;
