module.exports = function outloginNV(req, res, next) {
    if (req.kwNV) {
        res.redirect('/dangxuat');
    } else {
        return next();
    }
}