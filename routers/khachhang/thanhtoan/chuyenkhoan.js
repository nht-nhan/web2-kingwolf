const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const taikhoan = require('../../../models/taikhoan');
const relogin = require('../../../middlewares/khachhang/relogin');
const tb=require('../../../models/thongbao');
const mail = require('../../../models/mail');
const KH = require('../../../models/khachhang');
const format  = require('date-format');
const {format_money} = require('../../../models/functions')
const router = new Router();
router.use(relogin)
router.get('/',asyncHandler (async function(req,res){
    const get_all_tb= await tb.get_all(req.kwKH.taikhoan.id);
    const count_all_tb = await tb.count_get_all(req.kwKH.taikhoan.id);
    const get_all_L1= await tb.find_all_L1(req.kwKH.taikhoan.id);
    if(res.locals.kwKH==null)
    {
        res.locals.kwKH=req.kwKH;
    }
    if(req.kwKH.taikhoan.tinhtrang==false)
    {
        const thongbao=3;
        return res.render('khachhang/thanhtoan/chuyenkhoan',{thongbao,format,format_money,get_all_tb,count_all_tb,get_all_L1});
    }
    else
    {
        const thongbao=null;
        return res.render('khachhang/thanhtoan/chuyenkhoan',{thongbao,format,format_money,get_all_tb,count_all_tb,get_all_L1});
    }
}))
router.post('/',asyncHandler (async function(req,res){
    try {
        const get_all_tb= await tb.get_all(req.kwKH.taikhoan.id);
        const count_all_tb = await tb.count_get_all(req.kwKH.taikhoan.id);
        const get_all_L1= await tb.find_all_L1(req.kwKH.taikhoan.id);
        const stk=req.body.kw_stk;
        const tien1 = req.body.kw_tien.split('_').join('');
        const tien = Number(tien1.split('.').join(''));
        const tien_gd=Number(req.kwKH.taikhoan.tiengiaodich);
        const nd = req.body.kw_nd;
        const check_stk = await taikhoan.count_stk(stk);
        if(check_stk.count ==0)
        {
            const thongbao=1;
            return res.render('khachhang/thanhtoan/chuyenkhoan',{thongbao,format,format_money,get_all_tb,count_all_tb,get_all_L1});
        }
        else
        {
            const tien_kt=Number(tien_gd+tien);
            if(tien_kt>100000000 || tien>req.kwKH.taikhoan.sotien)
            {
                const thongbao=2;
                return res.render('khachhang/thanhtoan/chuyenkhoan',{thongbao,format,format_money,get_all_tb,count_all_tb,get_all_L1});
            }
            else
            {
                //--Khu vực trừ,cộng tiền--//
                await taikhoan.save_chuyenkhoan_tru(req.kwKH.taikhoan.sotaikhoan,tien);
                await taikhoan.save_chuyenkhoan_cong(stk,tien);  
                //--Khu vực save thông báo loại 1
                await tb.save_loai_1("L1",req.kwKH.taikhoan.sotaikhoan,stk,tien,nd,req.kwKH.taikhoan.id);
                const tk_nguoinhan= await KH.find_id_join_tk_stk(stk);
                await mail.send_chuyenkhoan(tk_nguoinhan.email,"KingWolf Bank thông báo mới",req.kwKH.taikhoan.sotaikhoan,nd,tien)
                const thongbao=0;
                res.render('khachhang/thanhtoan/chuyenkhoan',{thongbao,format,format_money,get_all_tb,count_all_tb,get_all_L1});
            }
        }
    } catch (error) {
        console.log("Thông báo lỗi: ",error)
        return res.status(500).render('maychu/500');
    }
}))
module.exports=router;
