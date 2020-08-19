const khachhang = require('../../models/khachhang');
const asynchandler = require('express-async-handler');

module.exports = asynchandler(async function authKH(req, res, next) {
    const khachhangId = req.session.KHid;
    res.locals.kwKH = null;
    if (!khachhangId) {
        return next();
    }
    const khachhangs = await khachhang.find_id_join_tk(khachhangId);
    if (!khachhangId) {
        return next();
    }
    req.kwKH = khachhangs;
    res.locals.kwKH = khachhangs;
    return next();
});