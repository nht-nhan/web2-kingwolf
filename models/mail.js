const nodemailer = require('nodemailer');

async function send(to, subject, token) {
    const links = 'Kích hoạt địa chỉ email bấm vào link: ' +process.env.HOSTS+'/kichhoat/' + token;
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.USERNAMES,
            pass: process.env.PWS,
        }
    });
    return transporter.sendMail({
        from: process.env.USERNAMES,
        to,
        subject,
        text: links,
    });
}
async function send_chuyenkhoan(to, subject, stk_nguoigui,noidung,tien) {
    const links = ` Bạn đã nhận được số tiền ${tien} từ số tài khoản ${stk_nguoigui} với nội dung : ${noidung} `;

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.USERNAMES,
            pass: process.env.PWS,
        }
    });
    return transporter.sendMail({
        from: process.env.USERNAMES,
        to,
        subject,
        text: links,
    });
}
async function send_tb(to, subject, loai,tien,_tien,_ma) {
   
    switch (loai) {
        case "1":
            //1 là rút tiền từ thanh toán
            var links = "Bạn đã rút -"+tien+" từ tài khoản thanh toán. Số dư trong tài khoản: "+_tien+" VNĐ";
            break;
        case "2":
            //2 là nạp tiền từ thanh toán
            var links = "Bạn đã nạp +"+tien+" từ tài khoản thanh toán. Số dư trong tài khoản: "+_tien+" VNĐ";
            break;
        case "3":
            //3 là gửi tiền từ tiết kiệm
            var links = "Bạn đã gửi "+tien+" tài khoản tiết kiệm có mã "+_ma+". Số dư trong tài khoản: "+_tien+" VNĐ";
            break;
        case "4":
            //4 là rút tiền từ tiết kiệm
            var links = "Bạn đã rut "+tien+" tài khoản tiết kiệm có mã "+_ma+". Số dư trong tài khoản: "+_tien+" VNĐ";
            break;
        default:
            break;
    }
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.USERNAMES,
            pass: process.env.PWS,
        }
    });
    return transporter.sendMail({
        from: process.env.USERNAMES,
        to,
        subject,
        text: links,
    });
}
async function sendpw(to, subject, name, token) {
    const links = 'Xin chào ' + name + ' ! Chúng tôi gửi mật khẩu cho bạn : ' + token;
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.USERNAMES,
            pass: process.env.PWS,
        }
    });
    return transporter.sendMail({
        from: process.env.USERNAMES,
        to,
        subject,
        text: links,
    });
}
async function forgetpw(to, subject, name, token) {
    const links = 'Xin chào ' + name + ' ! Chúng tôi gửi link reset cho bạn : ' +process.env.HOSTS+ '/quenmatkhau' + '/' + token;
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.USERNAMES,
            pass: process.env.PWS,
        }
    });
    return transporter.sendMail({
        from: process.env.USERNAMES,
        to,
        subject,
        text: links,
    });
}

module.exports = { send, sendpw, forgetpw ,send_tb,send_chuyenkhoan};