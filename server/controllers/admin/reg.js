const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const auth = {
    auth: {
        api_key: 'cd30f6ec8c5ec9ff7149de34ab1092e3-1f1bd6a9-57915c60',
        domain: 'sandboxed2c1b506f304c30b9cb1814fb21f877.mailgun.org'
    }
}
exports.reg = async (req, res, next) => {
    const { email } = req.body;

    const nodemailerMailgun = nodemailer.createTransport(mg(auth));
    nodemailerMailgun.sendMail({
        from: process.env.EMAIL_FROM,
        to: 'bellosamuel64@gmail.com',
        text: 'xxx'
    }, (err, info) => {
        if (err) {
            console.log(`Error: ${err}`);
        }
        else {
            console.log(`Response: ${info}`);
        }
    });
}