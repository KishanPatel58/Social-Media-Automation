const nodemailer = require("nodemailer");
const env = require("../environments/env");
const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS
    }
})

const sendEmail = async ({toemail,subject,html,text}) => {
    try {
        return await transport.sendMail({
            from: env.EMAIL_USER,
            to: toemail,
            subject: subject,
            text: text,
            html: html
        })
    } catch (error) {
        throw new Error("Problem to send email.")
    }
}

module.exports = sendEmail;