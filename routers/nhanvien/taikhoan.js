const { Router } = require('express');
const khachhang = require('../../models/khachhang');
const taikhoan = require('../../models/taikhoan');
const relogin = require('../../middlewares/nhanvien/relogin');
const asyncHandler = require('express-async-handler');
const router = new Router();
//-------------------[Nhân viên duyệt tài khoản]-------------------//
router.use(relogin);
   //=========[BEGIN: GET]=========//
    router.get('/', asyncHandler(async function(req, res) {
        if(res.locals.kwNV==null)
        {
            res.locals.kwNV=req.kwNV;
        }
        const User = await khachhang.find_all_where_cmnd();
        res.render('nhanvien/taikhoan',{User});
    }));
   //=========[END: GET]=========//
   //=========[BEGIN: POST]=========//
    router.post('/', asyncHandler(async function(req, res) {
        if(req.body.kqduyet)
        {
            const tk = await taikhoan.find_id(req.body.kqduyet);
            tk.kichhoat=true;
            tk.tinhtrang=true;
            const check = tk.save();
            if(check)
            {
                res.redirect('/nhanvien/taikhoan');
            }
        }
        if(req.body.kqduyet1)
        {
            const kh = await khachhang.find_one_id(req.body.kqduyet1);
            kh.cmndtruoc=null;
            kh.cmndsau=null;
            const check1 = kh.save();
            if(check1)
            {
                res.redirect('/nhanvien/taikhoan');
            }
        }

    }));
   //=========[END: POST]=========//
//-------------------[Nhân viên duyệt tài khoản]-------------------//
module.exports=router;