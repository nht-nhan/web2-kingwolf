module.exports = function logout(req, res) {
    if(req.session.khachhangId!=null)
    {
        console.log('Đăng xuất - Tài khoản Khách Hàng');
        req.session.khachhangId = null;
    }
    if(req.session.nvId!=null)
    {
        console.log('Đăng xuất - Tài khoản Nhân Viên');
        req.session.nvId=null;
    }
    req.session=null;
    return res.redirect('/');
};