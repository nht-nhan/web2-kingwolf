const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const relogin = require('../../middlewares/khachhang/relogin');
const {format_time} = require('../../models/functions');
const tb=require('../../models/thongbao');
const kh=require('../../models/khachhang');
const router = new Router();
//===[Khách Hàng]===//
router.use(relogin);
router.get('/',asyncHandler(async function(req, res){
    try {
        const get_all_tb= await tb.get_all(req.kwKH.taikhoan.id);
        const count_all_tb = await tb.count_get_all(req.kwKH.taikhoan.id);
        var sl_tb = await tb.count_all(req.kwKH.taikhoan.id);
        const sl =Number(sl_tb.count);
        const slkh = await kh.count_all();
        if(res.locals.kwKH==null)
        {
            res.locals.kwKH=req.kwKH;
        }
        if(req.kwKH.cmndtruoc==null || req.kwKH.cmndsau==null)
        {
            return res.redirect('khachhang/themthongtin');
        }
        if(req.kwKH.taikhoan.kichhoat==false)
        {
            const thongbao="KingWolf bank thông báo !";
            return res.render('khachhang/index',{thongbao,get_all_tb,count_all_tb,format_time,sl,slkh});
        }
        else
        {
            const thongbao=null;
           
            return res.render('khachhang/index',{thongbao,get_all_tb,count_all_tb,format_time,sl,slkh});
        }
    } catch (error) {
        console.log("Thông báo lỗi: ",error);
        return res.status(500).render('maychu/500');
    }
  }))
  module.exports=router;