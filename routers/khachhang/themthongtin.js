const { Router } = require('express');
const relogin = require('../../middlewares/khachhang/relogin');
const khachhang = require('../../models/khachhang');
const upload = require('../../middlewares/khachhang/upload');
const asyncHandler = require('express-async-handler');
const router = new Router();
//-------------------[Thêm thông tin]-------------------//
    router.use(relogin);
    //=========[BEGIN: GET]=========//
    router.get('/', asyncHandler(async function index(req, res) {
        return res.render('khachhang/themthongtin');
    }));
   //=========[END: GET]=========//
   //=========[BEGIN: POST]=========//
    router.post('/',upload.any('avatar_truoc','avatar_sau'),asyncHandler( async function index(req,res){
        try {
            const diachi = req.body.diachi_nha +" "+ req.body.diachi_xa +" "+ req.body.diachi_tp;
            req.files.forEach(function(i)
            {
                if(i.fieldname=="avatar_truoc")
                {
                    khachhang.save_images(req.kwKH,i.buffer,1,diachi);
                }
                if(i.fieldname=="avatar_sau")
                {
                    khachhang.save_images(req.kwKH,i.buffer,2,diachi);
                }
            })
            return res.redirect('/khachhang');
            
        } catch (error) {
            console.log("Thông báo lỗi: ",error);
            return res.status(500).render('maychu/500');
        }
    }))
   //=========[END: POST]=========//
//-------------------[Thêm thông tin]-------------------//
module.exports=router