const { Router } = require('express');
const relogin = require('../../../middlewares/khachhang/relogin');
const asyncHandler = require('express-async-handler');
const thanhtoan  = require('../../../models/thanhtoan');
const taikhoan =require('../../../models/taikhoan');
const format  = require('date-format');
const {format_money} = require('../../../models/functions');
const crypto= require('crypto');
const tb = require('../../../models/thongbao');
const router = new Router();

//-------------------[Nạp tiền]-------------------//
router.use(relogin);
   //=========[BEGIN: GET]=========//
    router.get('/', asyncHandler(async function index(req, res) {
        try {
            if(res.locals.kwKH==null)
            {
                res.locals.kwKH=req.kwKH;
            }
            const get_all_tb= await tb.get_all(req.kwKH.taikhoan.id);
            const count_all_tb = await tb.count_get_all(req.kwKH.taikhoan.id);
            const lay_ma=crypto.randomBytes(3).toString('hex').toUpperCase();
            const tt_nap = await thanhtoan.find_id_nap_tien(req.kwKH.taikhoan.id);
            if(req.kwKH.taikhoan.tinhtrang==false)
            {
                const thongbao=3;
                return res.render('khachhang/thanhtoan/naptien',{tt_nap,format,lay_ma,format_money,thongbao,get_all_tb,count_all_tb});
            }
            else
            {
                const thongbao=null;
                return res.render('khachhang/thanhtoan/naptien',{tt_nap,format,lay_ma,format_money,thongbao,get_all_tb,count_all_tb});
            }
            
        } catch (error) {
            console.log("Thông báo lỗi :", error);
            res.status(500).render('maychu/500');
        }
    }));
   //=========[END: GET]=========//
   //=========[BEGIN: POST]=========//
    router.post('/', asyncHandler(async function index(req, res) {
        
        try {
            if(res.locals.kwKH==null)
            {
                res.locals.kwKH=req.kwKH;
            }
            const tien1 = req.body.kw_rut.split('_').join('');
            const tien = Number(tien1.split('.').join(''));
            while(true)
            {
                const ma = req.kwKH.taikhoan.sotaikhoan.substring(4,8);
                const ramdonma = taikhoan.getRandomInt(10000,99999);
                const mathanhtoans= "NKW"+ma+ramdonma;
                const checkma = await thanhtoan.find_mathanhtoan(mathanhtoans);
                if(!checkma)
                {
                    const tien1=Number(req.kwKH.taikhoan.sotien) ;
                    const tien2=Number(tien);
                    const tien3=Number(tien1+tien2);
                    const create_tt = await thanhtoan.Create_TT(mathanhtoans,tien1,tien2,tien3,req.kwKH.taikhoan.id,2,false);
                    if(create_tt==0)
                    {
                        return res.redirect('/khachhang/thanhtoan/naptien');
                    }
                    break;
                }
            }
        } catch (error) {
            console.log("Thông báo lỗi :", error);
            res.status(500).render('maychu/500');
        }
    }));
   //=========[END: POST]=========//
//-------------------[Nạp tiền]-------------------//
module.exports=router;