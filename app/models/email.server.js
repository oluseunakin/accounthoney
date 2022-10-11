export function sendEmail(to, message) {
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'akindoyinoluseun@gmail.com',
            pass: 'sndsckdurdcggefm'
        }
    });

    var mailOptions = {
        from: 'akindoyinoluseun@gmail.com',
        to: to,
        subject: 'New Sale Alert',
        html: message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}