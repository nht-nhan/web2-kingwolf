const { Router } = require('express');
const tb = require('../../../models/thongbao');
const relogin = require('../../../middlewares/khachhang/relogin');
const asyncHandler = require('express-async-handler');
const format  = require('date-format');
const mail = require('../../../models/mail');
const {format_money} = require('../../../models/functions');
const tietkiem = require('../../../models/tietkiem');
const taikhoan = require('../../../models/taikhoan');
const router = new Router();
//-------------------[Rút tiết kiệm]-------------------//
router.use(relogin);
   //=========[BEGIN: GET]=========//
    router.get('/',asyncHandler(async function (req,res){
        try {
            const get_all_tb= await tb.get_all(req.kwKH.taikhoan.id);
            const count_all_tb = await tb.count_get_all(req.kwKH.taikhoan.id);
            if(res.locals.kwKH==null)
            {
                res.locals.kwKH=req.kwKH;
            }
            if(req.kwKH.taikhoan.tinhtrang==false)
            {
                const thongbao=3;
                const getall = await tietkiem.get_all(req.kwKH.taikhoan.id);
                return res.render('khachhang/tietkiem/rut',{format_money,getall,format,thongbao,get_all_tb,count_all_tb});
            }
            const thongbao=null;
            const getall = await tietkiem.get_all(req.kwKH.taikhoan.id);
            return res.render('khachhang/tietkiem/rut',{format_money,getall,format,thongbao,get_all_tb,count_all_tb});
        } catch (error) {
            console.log("Thông báo lỗi: ",error);
            res.status(500).render('maychu/500');
        }
    }));
   //=========[END: GET]=========//
   //=========[BEGIN: POST]=========//
      router.post('/',asyncHandler(async function(req,res){
        try {
            if(res.locals.kwKH==null)
            {
                res.locals.kwKH=req.kwKH;
            }
            const id_tt= req.body.btn_rut_tt;
            const tk = await tietkiem.get_id(id_tt);
            const tt = await taikhoan.find_id(tk.taikhoanId);
            if(tk.loai==1)
            {
                const day_hientai = tietkiem.getday(tk.thoigiandb,new Date());
                const tienlai = Number(tk.sotien*(tk.laisuat/100)*(day_hientai/360));
                const tientra = Math.round( tk.sotien + tienlai);
                const check_save = await taikhoan.save_money_tk(tt,tientra);
                if(check_save)
                {
                    const check_delete = await tietkiem.delete_tk(tk.id);
                    if(check_delete)
                    {
                        await tb.save_loai("L4",tientra,`Bạn đã rút ${tientra} từ tài khoản tiết kiệm với mã ${tk.matietkiem}`,false,req.kwKH.taikhoan.id);
                        await mail.send_tb(req.kwKH.email,"KingWolf-Bank thông báo mới","4",tientra,Number(req.kwKH.taikhoan.sotien+tientra),tk.matietkiem);
                        res.redirect('/khachhang/taikhoan');
                    }
                }
            }
            else
            {
                const day_hientai1 = tietkiem.getday(tk.thoigiandb,new Date());
                const tienlai = Number(tk.sotien*(0.2/100)*(day_hientai1/360));
                const tientra = Math.round(tk.sotien + tienlai);
                const check_save1 = await taikhoan.save_money_tk(tt,tientra);
                if(check_save1)
                {
                    const check_delete1 = await tietkiem.delete_tk(tk.id);
                    if(check_delete1)
                    {
                        await tb.save_loai("L4",tientra,`Bạn đã rút ${tientra} từ tài khoản tiết kiệm với mã ${tk.matietkiem}`,false,req.kwKH.taikhoan.id);
                        await mail.send_tb(req.kwKH.email,"KingWolf-Bank thông báo mới","4",tientra,Number(req.kwKH.taikhoan.sotien+tientra),tk.matietkiem);
                        res.redirect('/khachhang/taikhoan');
                    }
                }

            }
            
        } catch (error) {
            console.log("Thông báo lỗi: ",error);
            res.status(500);
        }
      }))
   //=========[END: POST]=========//
//-------------------[Rút tiết kiệm]-------------------//
module.exports=router