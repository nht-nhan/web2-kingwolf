module.exports = function reloginNV(req, res, next) {
    if (!req.kwNV ) {
        res.redirect('/');
    } else {
        return next();
    }
}