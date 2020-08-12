const nodemailer = require('nodemailer');

async function send(to, subject, token) {
    const links = 'Kích hoạt địa chỉ email bấm vào link: ' +'http://localhost:3000'+'/kichhoat/' + token;
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'jackscore1999@gmail.com',
            pass: 'Jack12300',
        }
    });
    return transporter.sendMail({
        from: 'jackscore1999@gmail.com',
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
            user: 'jackscore1999@gmail.com',
            pass: 'Jack12300',
        }
    });
    return transporter.sendMail({
        from: 'jackscore1999@gmail.com',
        to,
        subject,
        text: links,
    });
}
async function forgetpw(to, subject, name, token) {
    const links = 'Xin chào ' + name + ' ! Chúng tôi gửi link reset cho bạn : ' +'http://localhost:3000'+ '/quenmatkhau' + '/' + token;
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'jackscore1999@gmail.com',
            pass: 'Jack12300',
        }
    });
    return transporter.sendMail({
        from: 'jackscore1999@gmail.com',
        to,
        subject,
        text: links,
    });
}
module.exports = { send, sendpw, forgetpw };
