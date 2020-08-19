module.exports = function reloginKH(req, res, next) {
    if (!req.kwKH ) {
        res.redirect('/');
    } else {
        return next();
    }
}