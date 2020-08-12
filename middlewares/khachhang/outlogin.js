module.exports = function outloginKH(req, res, next) {
	// a
    if (req.kwKH ) {
        res.redirect('/dangxuat');
    } else {
        return next();
    }

}