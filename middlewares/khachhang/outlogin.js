module.exports = function outloginKH(req, res, next) {
	//kiem tra trang ko su dung cookie
    if (req.kwKH ) {
        res.redirect('/dangxuat');
    } else {
        return next();
    }
}