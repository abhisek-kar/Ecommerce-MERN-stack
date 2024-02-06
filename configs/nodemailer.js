const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "Smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "raja.bbsr001@gmail.com",
    pass: "huhs teqv ytbv yawr",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendPasswordResetEmail({ to, subject, text, html }) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"noreply" <raja.bbsr001@gmail.com>', // sender address
    to,
    subject,
    text,
    html,
  });

  return info;
}

module.exports = sendPasswordResetEmail;
