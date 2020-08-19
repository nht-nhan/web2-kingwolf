const {Router} = require('express');
const asyncHandler = require('express-async-handler');
const router =new Router();
//===[Trang chủ]===//
router.get('/',asyncHandler (async function(req,res){
    return res.render('khach/index');
}))
module.exports=router