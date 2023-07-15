// const nodemailer = require('nodemailer');




/* const sendEmail = async (options) => {
    const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transport.sendMail(message);
}
 */

const emailjs = require('@emailjs/nodejs')


{

}
const sendEmail = async ({ recipient, to_name, subject, link1, message1, message2 }) => {
    const templateParams = {
        recipient, to_name, subject, link1, message1, message2
    }


    emailjs
        .send(
            process.env.EMAIL_SERVICE_ID,               // Service Id
            process.env.EMAIL_ACTIVATION_TEMPLATE,      // Template id - Admin Reset Password
            templateParams,                             // templated parameters
            {
                publicKey: process.env.EMAIL_PUBLIC_KEY,
                privateKey: process.env.EMAIL_PRIVATE_KEY
            }
        )
        .then((response) => {
            console.log('SUCCESS!', response.status, response.text);

        }, (error) => {
            console.log('FAILED...', error);
        });

}

module.exports = sendEmail;