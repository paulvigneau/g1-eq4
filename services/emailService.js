const nodeMailer = require('nodemailer');

function sendEmail(projectId, email, subject, content) {
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'cdpproject33@gmail.com',
            pass: 'cdpscrum'
        }
    });

    const mailOptions = {
        from: 'cdpproject33@gmail.com',
        to: email,
        subject: subject,
        text: content
    };

    return transporter.sendMail(mailOptions);
}

module.exports = { sendEmail };
