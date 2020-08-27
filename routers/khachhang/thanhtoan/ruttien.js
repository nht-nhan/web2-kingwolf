const { Router } = require('express');
const relogin = require('../../../middlewares/khachhang/relogin');
const mail = require('../../../models/mail');
const asyncHandler = require('express-async-handler');
const thanhtoan  = require('../../../models/thanhtoan');
const taikhoan =require('../../../models/taikhoan');
const tb=require('../../../models/thongbao');
const format  = require('date-format');
const {format_money} = require('../../../models/functions');
const crypto= require('crypto');
const router = new Router();

//-------------------[Rút tiền]-------------------//
router.use(relogin);
   //=========[BEGIN: GET]=========//
    router.get('/', asyncHandler(async function index(req, res) {
        try {
            const get_all_tb= await tb.get_all(req.kwKH.taikhoan.id);
            const count_all_tb = await tb.count_get_all(req.kwKH.taikhoan.id);
            const lay_ma=crypto.randomBytes(3).toString('hex').toUpperCase();
            const tt_rut = await thanhtoan.find_id_rut_tien(req.kwKH.taikhoan.id);
            if(res.locals.kwKH==null)
            {
                res.locals.kwKH=req.kwKH;
            }
            if(req.kwKH.taikhoan.tinhtrang==false)
            {
                const thongbao=3;
                return res.render('khachhang/thanhtoan/ruttien',{tt_rut,format,lay_ma,thongbao,format_money,get_all_tb,count_all_tb});
            }
            else
            {
                const thongbao=null;
                return res.render('khachhang/thanhtoan/ruttien',{tt_rut,format,lay_ma,thongbao,format_money,get_all_tb,count_all_tb});
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
            const get_all_tb= await tb.get_all(req.kwKH.taikhoan.id);
            const count_all_tb = await tb.count_get_all(req.kwKH.taikhoan.id);
            const lay_ma=crypto.randomBytes(3).toString('hex').toUpperCase();
            const tt_rut = await thanhtoan.find_id_rut_tien(req.kwKH.taikhoan.id);
            if(res.locals.kwKH==null)
            {
                return res.locals.kwKH=req.kwKH;
            }
            const tien1 = req.body.kw_rut.split('_').join('');
            const tien = Number(tien1.split('.').join(''));
            if(tien>req.kwKH.taikhoan.sotien || tien>20000000)
            {
                const thongbao = 0;
                return res.render('khachhang/thanhtoan/ruttien',{tt_rut,format_money,format,lay_ma,thongbao,get_all_tb,count_all_tb});
            }
            else
            {
                while(true)
                {
                    const ma = req.kwKH.taikhoan.sotaikhoan.substring(4,8);
                    const ramdonma = taikhoan.getRandomInt(10000,99999);
                    const mathanhtoans= "RKW"+ma+ramdonma;
                    const checkma = await thanhtoan.find_mathanhtoan(mathanhtoans);
                    if(!checkma)
                    {
                        const tien1=Number(req.kwKH.taikhoan.sotien) ;
                        const tien2=tien;
                        const tien3=Number(tien1-tien2);
                        const tk = await taikhoan.find_id(req.kwKH.taikhoan.id);
                        tk.sotien=tien3;
                        const check_save = tk.save();
                        if(check_save)
                        {
                            const create_tt = await thanhtoan.Create_TT(mathanhtoans,tien1,tien2,tien3,tk.id,1,true);
                            if(create_tt==0)
                            {
                                const thongbao=1;
                                res.render('khachhang/thanhtoan/ruttien',{tt_rut,format,lay_ma,thongbao,format_money,get_all_tb,count_all_tb});
                                await tb.save_loai("L2",tien,`Bạn đã rút -${tien} từ tài khoản thanh toán`,false,req.kwKH.taikhoan.id);
                                await mail.send_tb(req.kwKH.email,"KingWolf-Bank thông báo mới","1",tien,tien3,0);
                                break;
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.log("Thông báo lỗi :", error);
            res.status(500).render('maychu/500');
        }
    }));
   //=========[END: POST]=========//
//-------------------[Rút tiền]-------------------//
module.exports=router;