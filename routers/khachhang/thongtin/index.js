const { Router } = require('express');
const relogin = require('../../../middlewares/khachhang/relogin');
const asyncHandler = require('express-async-handler');
const khachhang = require('../../../models/khachhang');
const upload = require('../../../middlewares/khachhang/upload');
const tb = require('../../../models/thongbao');
const router = new Router();
//-------------------[Thông tin cá nhân]-------------------//
    router.use(relogin);
   //=========[BEGIN: GET]=========//
    router.get('/', asyncHandler(async function index(req, res) {
        try {
            if(res.locals.kwKH==null)
            {
                res.locals.kwKH=req.kwKH;
            }
            const thongbao=null;
            const get_all_tb= await tb.get_all(req.kwKH.taikhoan.id);
            const count_all_tb = await tb.count_get_all(req.kwKH.taikhoan.id);
            res.render('khachhang/thongtin',{thongbao,get_all_tb,count_all_tb})

        } catch (error) {
            console.log("Thông báo lỗi :", error);
            res.redirect('/500');
        }
    }));
   //=========[END: GET]=========//
   //=========[BEGIN: POST]=========//
    router.post('/',upload.single('anh_dai_dien'),asyncHandler(async function index(req, res) {
        try {
            const get_all_tb= await tb.get_all(req.kwKH.taikhoan.id);
            const count_all_tb = await tb.count_get_all(req.kwKH.taikhoan.id);
            if(res.locals.kwKH==null)
            {
                res.locals.kwKH=req.kwKH;
            }
            if(req.body.btn_pw=='1')
            {
                const checkpwhientai = khachhang.verifypw(req.body.pw_hientai,req.kwKH.matkhau);
                if(checkpwhientai)
                {
                    const pw_new_1= req.body.pw_moi_1;
                    const pw_new_2= req.body.pw_moi_2;
                    if(pw_new_1==pw_new_2)
                    {
                        const u = await khachhang.find_one_id(req.kwKH.id);
                        const hashpw = khachhang.hashpw(pw_new_1);
                        u.matkhau=hashpw;
                        const checku = u.save();
                        if(checku)
                        {
                            const thongbao="1";
                            res.render('khachhang/thongtin/index',{thongbao,get_all_tb,count_all_tb});
                        }
                        
                    }
                    else
                    {
                        const thongbao="2";
                        res.render('khachhang/thongtin/index',{thongbao,get_all_tb,count_all_tb});
                    }
                }
                else
                {
                    const thongbao="3";
                    res.render('khachhang/thongtin/index',{thongbao,get_all_tb,count_all_tb});
                }
            }
            if(req.body.btn_pw=='2')
            {
                if(req.file)
                {
                    await khachhang.save_anhdaidien(req.kwKH.id,req.file.buffer);
                }
                if(req.body.user_nickname)
                {
                    await khachhang.save_nickname(req.kwKH.id,req.body.user_nickname)
                }
                return res.redirect('/khachhang/thongtin');
            }
            console.log(req.body)
            console.log(req.file);
        } catch (error) {
            console.log("Thông báo lỗi :", error);
            res.redirect('/500');
        }
    }));
   //=========[END: POST]=========//
//-------------------[Thông tin cá nhân]-------------------//
module.exports=router