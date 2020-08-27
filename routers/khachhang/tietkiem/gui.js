const { Router } = require('express');
const tb = require('../../../models/thongbao');
const relogin = require('../../../middlewares/khachhang/relogin');
const asyncHandler = require('express-async-handler');
const format  = require('date-format');
const mail=require('../../../models/mail');
const {format_money} = require('../../../models/functions');
const tietkiem = require('../../../models/tietkiem');
const taikhoan = require('../../../models/taikhoan');
const router = new Router();
//-------------------[Gửi tiết kiệm]-------------------//
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
            res.render('khachhang/tietkiem/gui',{format_money,thongbao,get_all_tb,count_all_tb});
        }
        const thongbao=null;
        res.render('khachhang/tietkiem/gui',{format_money,thongbao,get_all_tb,count_all_tb});
    } catch (error) {
        console.log("Thông báo lỗi: ",error);
        res.status(500).render('maychu/500');
    }
  }));
   //=========[END: GET]=========//
   //=========[BEGIN: POST]=========//
   router.post('/',asyncHandler(async function (req,res){
        try {
            if(req.body.kw_tt_khongkyhan=='123')
            {
                    /* input tiền : kw_tt_tien_khongkyhan */
                    //Bước 1 lấy tiền lưu xuống database
                    //Bước 2 render lại 'khachhang/tietkiem/gui'
                const tien1 = req.body.kw_tt_tien_kokyhan.split('_').join('');
                const tiengui_kokyhan = Number(tien1.split('.').join(''));
                if(tiengui_kokyhan>req.kwKH.taikhoan.sotien || tiengui_kokyhan<1000000 )
                {
                    return
                }
                const get_tk = await taikhoan.find_id(req.kwKH.taikhoan.id);
                const check_save_money = await taikhoan.save_money_tt(get_tk,tiengui_kokyhan);
                if(check_save_money)
                {
                    const ma = req.kwKH.taikhoan.sotaikhoan.substring(4,8);
                    const ramdonma = taikhoan.getRandomInt(10000,99999);
                    const matietkiems= "TTKW"+ma+ramdonma;
                    const checkma = await tietkiem.find_matt(matietkiems);
                    if(checkma.count==0)
                    {
                        const getdateonly = new Date();
                        const check_tao_tt = await tietkiem.save_khongkyhan(matietkiems,getdateonly,req.kwKH.taikhoan.id,tiengui_kokyhan);
                        if(check_tao_tt)
                        {
                            await tb.save_loai("L5",tiengui_kokyhan,`Bạn đã gửi ${tiengui_kokyhan} tài khoản tiết kiệm có mã ${matietkiems}`,false,req.kwKH.taikhoan.id);
                            await mail.send_tb(req.kwKH.email,"KingWolf-Bank thông báo mới","3",tiengui_kokyhan,Number(req.kwKH.taikhoan.sotien-tiengui_kokyhan),matietkiems);
                            res.redirect('/khachhang/tietkiem')
                        }
                    }
                }
                
            }
            if(req.body.kw_tt_cokyhan=='')
            {
                    /* 
                    input tiền : kw_tt_tien_cokyhan
                    input số tháng : kw_thang
                    input loại để tất toán hoạc giai hạn: kw_loai 
                    //Bước 1 lấy tiền,tháng,loại lưu xuống database
                    //Bước 2 render lại 'khachhang/tietkiem/gui'
                    */
                const tien1 = req.body.kw_tt_tien_cokyhan.split('_').join('');
                const tiengui_cokyhan = Number(tien1.split('.').join(''));
                const sothang =  Number(req.body.kw_thang);
                const soloai = Number(req.body.kw_loai);
                const lai = tietkiem.get_lai_suat(sothang);
                if(tiengui_cokyhan>req.kwKH.taikhoan.sotien || tiengui_cokyhan<1000000)
                {
                    return
                }
                const get_tk = await taikhoan.find_id(req.kwKH.taikhoan.id);
                const check_save_money = await taikhoan.save_money_tt(get_tk,tiengui_cokyhan);
                if(check_save_money)
                {
                    const ma = req.kwKH.taikhoan.sotaikhoan.substring(4,8);
                    const ramdonma = taikhoan.getRandomInt(10000,99999);
                    const matietkiems= "TTKW"+ma+ramdonma;
                    const checkma = await tietkiem.find_matt(matietkiems);
                    if(checkma.count==0)
                    {
                        const getdateonly = new Date();
                        const getdateketthuc = new Date();
                        getdateketthuc.setDate(getdateketthuc.getDate() + (sothang*30));
                        console.log(getdateketthuc);  
                        const check_tao_tt = await tietkiem.save_cokyhan(matietkiems,getdateonly,sothang,lai,soloai,tiengui_cokyhan,req.kwKH.taikhoan.id,getdateketthuc);
                        if(check_tao_tt)
                        {
                            await tb.save_loai("L5",tiengui_cokyhan,`Bạn đã gửi ${tiengui_cokyhan} tài khoản tiết kiệm có mã ${matietkiems}`,false,req.kwKH.taikhoan.id);
                            await mail.send_tb(req.kwKH.email,"KingWolf-Bank thông báo mới","3",tiengui_cokyhan,Number(req.kwKH.taikhoan.sotien-tiengui_cokyhan),matietkiems);
                            res.redirect('/khachhang/tietkiem')
                        }
                    }
                }
            }
        } catch (error) {
            console.log("Thông báo lỗi: ",error)
            res.status(500).render('maychu/500');
        }

   }))
   //=========[END: POST]=========//
//-------------------[Gửi tiết kiệm]-------------------//
module.exports=router;