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

module.exports = { send, sendpw, forgetpw };