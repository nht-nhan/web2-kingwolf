const { Router } = require('express');
const thanhtoan = require('../../../models/thanhtoan');
const relogin = require('../../../middlewares/khachhang/relogin');
const asyncHandler = require('express-async-handler');
const format  = require('date-format');
const {format_money} = require('../../../models/functions');
const tb = require('../../../models/thongbao');
const router = new Router();
//-------------------[Tài khoản thanh toán ]-------------------//
router.use(relogin);
   //=========[BEGIN: GET]=========//
      router.get('/',asyncHandler(async function (req,res){
        try {
            if(res.locals.kwKH==null)
            {
                res.locals.kwKH=req.kwKH;
            }
            const get_all_tb= await tb.get_all(req.kwKH.taikhoan.id);
            const count_all_tb = await tb.count_get_all(req.kwKH.taikhoan.id);
            const tt = await thanhtoan.find_id_all(req.kwKH.taikhoan.id);
            res.render('khachhang/thanhtoan/index',{tt,format,format_money,get_all_tb,count_all_tb});
        } catch (error) {
            console.log("Thông báo lỗi: ",error);
            res.status(500).render('maychu/500');
        }
      }));
   //=========[END: GET]=========//
//-------------------[Tài khoản thanh toán ]-------------------//
module.exports=router;