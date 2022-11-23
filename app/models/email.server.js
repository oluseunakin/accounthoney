export function sendEmail(to, message) {
  const nodemailer = require("nodemailer");

  const testAccount = nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  var mailOptions = {
    from: "akindoyinoluseun@gmail.com",
    to: to,
    subject: "New Sale Alert",
    html: message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
