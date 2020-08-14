const asyncHandler=require('express-async-handler');
module.exports = asyncHandler( async function index(req,res)
{
	//Khach ghe tham
    if(req.session.khachhangId || req.session.nvId!=null)
    {
        req.session.khachhangId = null;
        req.session.nvId=null;
        req.session=null;
    }
    res.render('guest/index');
});