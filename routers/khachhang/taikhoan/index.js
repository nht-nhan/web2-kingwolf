const { Router } = require('express');
const relogin = require('../../../middlewares/khachhang/relogin');
const asyncHandler = require('express-async-handler');
const tb =require('../../../models/thongbao');
const format  = require('date-format');
const {format_money} = require('../../../models/functions');
const router = new Router();
//-------------------[Tài khoản ngân hàng]-------------------//
    router.use(relogin)
   //=========[BEGIN: GET]=========//
   router.get('/', asyncHandler(async function index(req, res) {
    try {
        if(res.locals.kwKH==null)
        {
            res.locals.kwKH=req.kwKH;
        }
        const get_all_tb= await tb.get_all(req.kwKH.taikhoan.id);
        const count_all_tb = await tb.count_get_all(req.kwKH.taikhoan.id);
        res.render('khachhang/taikhoan/index',{format,format_money,get_all_tb,count_all_tb});

    } catch (error) {
        console.log("Thông báo lỗi :", error);
        res.status(500).render('maychu/500');
    }
}));
   //=========[END: GET]=========//
//-------------------[Tài khoản ngân hàng]-------------------//
module.exports=router;