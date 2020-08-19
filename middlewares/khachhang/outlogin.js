module.exports = function outloginKH(req, res, next) {
    if (req.kwKH ) {
        res.redirect('/dangxuat');
    } else {
        return next();
    }
}