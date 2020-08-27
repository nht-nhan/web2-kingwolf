const express = require('express');
const cookiesession = require('cookie-session');
const bodyParser = require('body-parser');
const db = require('./models/db');
const app = express();
const port = process.env.PORT || 3000;
//Cookie
app.use(cookiesession({
    name: 'session',
    keys: ['123456'],
    maxAge: 24 * 60 * 60 * 1000,
}));
//Default

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use("/public", express.static('public'));

//Middlewares
//--[Khách hàng]--//
app.use(require('./middlewares/khachhang/index')); 
//--[Nhân Viên]--//
app.use(require('./middlewares/nhanvien/index')); 


//Router
//=============Máy Chủ=============//
app.use('/dangky', require('./routers/maychu/dangky'));
app.use('/dangnhap', require('./routers/maychu/dangnhap'));
app.use('/kichhoat', require('./routers/maychu/kichhoat'));
app.use('/quenmatkhau', require('./routers/maychu/quenmatkhau'));
app.get('/dangxuat',require('./routers/maychu/dangxuat'));
//=================================//

//=============Khách=============//
app.use('/', require('./routers/khach/index'));
//===============================//

//=============Khách Hàng=============//
app.use('/khachhang',require('./routers/khachhang/index'));
app.use('/khachhang/tb',require('./routers/khachhang/tb'));
app.use('/khachhang/themthongtin',require('./routers/khachhang/themthongtin'));
app.use('/khachhang/thongtin',require('./routers/khachhang/thongtin/index'));
app.use('/khachhang/taikhoan',require('./routers/khachhang/taikhoan/index'));
app.use('/khachhang/thanhtoan',require('./routers/khachhang/thanhtoan/index'));
app.use('/khachhang/tietkiem',require('./routers/khachhang/tietkiem/index'));
app.use('/khachhang/thanhtoan/naptien',require('./routers/khachhang/thanhtoan/naptien'));
app.use('/khachhang/thanhtoan/ruttien',require('./routers/khachhang/thanhtoan/ruttien'));
app.use('/khachhang/thanhtoan/chuyenkhoan',require('./routers/khachhang/thanhtoan/chuyenkhoan'));
app.use('/khachhang/tietkiem/gui',require('./routers/khachhang/tietkiem/gui'));
app.use('/khachhang/tietkiem/rut',require('./routers/khachhang/tietkiem/rut'));
//====================================//

//=============Nhân Viên=============//
app.use('/nhanvien',require('./routers/nhanvien/index'));
app.use('/nhanvien/danhsach',require('./routers/nhanvien/danhsach'));
app.use('/nhanvien/taikhoan',require('./routers/nhanvien/taikhoan'));
app.use('/nhanvien/naptien',require('./routers/nhanvien/naptien'));
//===================================//
app.use(function(req,res){
    res.status(404).render('maychu/404',{home:process.env.HOSTS});
});
//Run server
db.sync().then(function() {
    app.listen(port, () => console.log(`server listening on port ${port}!`));
}).catch(function(err) {
    console.error(err);
});
//----------------------------------------------------------------------------------------------//


//luu tam 
// view time : <%=format('dd/mm/yyyy hh:MM:ss', i.thoigianbd)%>
// router : const format= require('date-format');