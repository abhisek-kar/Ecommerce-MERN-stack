const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "Smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "raja.bbsr001@gmail.com",
    pass: "huhs teqv ytbv yawr",
  },
});

// async..await is not allowed in global scope, must use a wrapper
// async function sendEmail({ to, subject, text, html }) {
//   // send mail with defined transport object
//   const info = await transporter.sendMail({
//     from: '"noreply" <raja.bbsr001@gmail.com>', // sender address
//     to,
//     subject,
//     text,
//     html,
//   });

//   return info;
// }
let sendEmail = async function ({ to, subject, text, html }) {
  try {
    let info = await transporter.sendMail({
      from: '"noreply" <raja.bbsr001@gmail.com>', // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });
    console.log("scuccess", info);
    return info;
  } catch (error) {
    console.log("fail", error);
    return error;
  }
};

module.exports = sendEmail;
