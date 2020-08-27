const { Router } = require('express');
const taikhoan = require('../../models/taikhoan');
const thanhtoan = require('../../models/thanhtoan');
const tb=require('../../models/thongbao');
const mail=require('../../models/mail');
const relogin = require('../../middlewares/nhanvien/relogin');
const asyncHandler = require('express-async-handler');
const router = new Router();
//-------------------[Nhân viên duyệt nạp tiền]-------------------//
   //=========[BEGIN: GET]=========//
    router.get('/', asyncHandler(async function(req, res) {
        const User = await thanhtoan.find_all_naptien();
        res.render('nhanvien/naptien',{User});
    }));
   //=========[END: GET]=========//
   //=========[BEGIN: POST]=========//
    router.post('/', asyncHandler(async function(req, res) {
        if(req.body.kqduyet)
        {
            const tt = await thanhtoan.find_mathanhtoan(req.body.kqduyet);
            const tk= await taikhoan.find_id(tt.taikhoanId);
            const sotien = Number(tk.sotien);
            const tien2 = tt.tien_2;
            const tien3 = sotien+tien2;
            tt.tien_1=sotien;
            tt.tien_3=tien3;
            tt.tinhtrang=true;
            const checktt = tt.save();
            if(checktt)
            {
                tk.sotien=tk.sotien+tien2;
                const checktk=tk.save();
                if(checktk)
                {
                    await tb.save_loai("L3",tien2,`Bạn đã nạp +${tien2} từ tài khoản thanh toán`,false,tk.id);
                    res.redirect('/nhanvien/naptien');
                }
            }
        }
        if(req.body.kqduyet1)
        {
            const tt = await thanhtoan.find_mathanhtoan(req.body.kqduyet1);
            tt.tinhtrang=null;
            const checktt=tt.save();
            if(checktt)
            {
                res.redirect('/nhanvien/naptien');
            }
        }
    }));
   //=========[END: POST]=========//
//-------------------[Nhân viên duyệt nạp tiền]-------------------//
module.exports = router