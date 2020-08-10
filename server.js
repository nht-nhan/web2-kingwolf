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
app.use('/dangky',require('./router/maychu/dangky'));
app.use('/dangnhap',require('./router/maychu/dangnhap'));
app.use('/kichhoat',require('./router/maychu/kichhoat'));
app.use('/quenmatkhau',require('./router/maychu/quenmatkhau'));
//=================================//

//=============Khách=============//
app.get('/', require('./router/guest/index'));
//===============================//

//=============Khách Hàng=============//
app.get('/dangxuat',require('./router/khachhang/dangxuat'));
app.use('/khachhang',require('./router/khachhang/index'));
app.use('/khachhang/themthongtin',require('./router/khachhang/themthongtin'));
app.use('/khachhang/thongtin',require('./router/khachhang/thongtin'));
app.use('/khachhang/taikhoan',require('./router/khachhang/taikhoan'));
app.use('/khachhang/thanhtoan',require('./router/khachhang/thanhtoan'));
app.use('/khachhang/thanhtoan/ruttien',require('./router/khachhang/thanhtoan/ruttien'));
app.use('/khachhang/thanhtoan/naptien',require('./router/khachhang/thanhtoan/naptien'));
app.use('/khachhang/thanhtoan/chuyentiennoibo',require('./router/khachhang/chuyentiennoibo'));
app.use('/khachhang/tietkiem',require('./router/khachhang/tietkiem/index'));
app.use('/khachhang/tietkiem/gui',require('./router/khachhang/tietkiem/gui'));
app.use('/khachhang/tietkiem/rut',require('./router/khachhang/tietkiem/rut'));
//====================================//

//=============Nhân Viên=============//
app.use('/nhanvien',require('./router/nhanvien/index'));
app.use('/nhanvien/danhsach',require('./router/nhanvien/danhsach'));
app.use('/nhanvien/taikhoan',require('./router/nhanvien/taikhoan'));
app.use('/nhanvien/naptien',require('./router/nhanvien/naptien'));
//===================================//

//Run server
db.sync().then(function() {
    app.listen(port, () => console.log(`server listening on port ${port}!`));
}).catch(function(err) {
    console.error(err);
});
//----------------------------------------------------------------------------------------------//
/* #TODO:
- [Chuyển khoản nội bộ] : Chưa làm xử lý POST 
- [Tiết kiệm tài khoản] : Chưa làm 
- [Thông tin tài khoản] : Chưa làm xử lý POST thay đổi thông tin  
- [Thông báo (đọc và chưa đọc)]: Chưa làm 
- [Chuyển khoảng liên ngân hàng] : Đợi API của thầy */

//luu tam 
// view time : <%=format('dd/mm/yyyy hh:MM:ss', i.thoigianbd)%>
// router : const format= require('date-format');