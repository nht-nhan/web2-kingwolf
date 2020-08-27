const { Router } = require('express');
const khachhang = require('../../models/khachhang');
const asyncHandler = require('express-async-handler');
const router = new Router();
//===[Đăng Nhập]===//
router.get('/',asyncHandler (async function(req,res){
    const thongbao=null;
    return res.render('maychu/dangnhap',{thongbao});
}))
router.get('/:timkiem',asyncHandler(async function(req,res){
    return res.status(404).render('maychu/404',{home:process.env.HOSTS});
}))
router.post('/',asyncHandler(async function(req,res){
    const thongbao = [];
    const emails = req.body.kw_email;
    const pw = req.body.kw_password;
    const KH = await khachhang.find_one_email(emails);
    try {
        if(KH)
        {
            const checktoken = KH.tokenkichhoat;
            if(checktoken==null)
            {
                const checkpw = khachhang.verifypw(pw,KH.matkhau);
                if(checkpw)
                {
                    req.session.KHid=KH.id;
                    return res.redirect('/khachhang');
                }
                else
                {
                    const loi = "Mật khẩu của bạn bị sai ";
                    thongbao.push(loi);
                    return res.render('maychu/dangnhap', { thongbao });
                }
            }
            else
            {
                const loi = "Email của bạn chưa kích hoạt . Kiểm tra lại hộp thư Email";
                thongbao.push(loi);
                return res.render('maychu/dangnhap', { thongbao });
            }
        }
        else
        {
            const loi = "Email của bạn không tồn tại trên hệ thống";
            thongbao.push(loi);
            return res.render('maychu/dangnhap', { thongbao });
        }
    } catch (error) {
        console.log("Thông báo lỗi :", error);
        return res.status(500).render('maychu/500');
    }
}))
module.exports=router;