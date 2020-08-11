const nhanvien = require('../../models/nhanvien');
const asynchandler = require('express-async-handler');

module.exports = asynchandler(async function authNV(req, res, next) {
    const nhanvienID = req.session.nvId;
    res.locals.kwNV = null;
    if (!nhanvienID) {
        return next();
    }
    const NVID = await nhanvien.findbyid(nhanvienID);
    if (!nhanvienID) {
        return next();
    }
    req.kwNV = NVID;
    res.locals.kwNV = NVID; 
    return next();
});