const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const relogin = require('../../middlewares/khachhang/relogin')
const tb=require('../../models/thongbao');
const router = new Router();
//===[Khách Hàng]===//
router.use(relogin);
router.get('/:id',asyncHandler(async function(req, res){
    try {
        if(res.locals.kwKH==null)
        {
            res.locals.kwKH=req.kwKH;
        }
        const {id} = req.params;
        const loai= await tb.read(id);
        switch(loai)
        {
            case "L2":
                res.redirect('/khachhang/thanhtoan/ruttien');
                break;
            case "L3":
                res.redirect('/khachhang/thanhtoan/naptien');
                break;
            case "L4":
                res.redirect('/khachhang/tietkiem');
                break;
            default:
                res.redirect('/khachhang/tietkiem');
                break;
        }
    } catch (error) {
        console.log("Thông báo lỗi: ",error);
        return res.sendStatus(500);
    }
  }))
  module.exports=router;