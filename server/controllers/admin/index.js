const ErrorResponse = require('../../utils/errorResponse');
const Staff = require('../../models/Staff');
const Loan = require('../../models/Loan');

const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const auth = {
    auth: {
        api_key: process.env.EMAIL_API_KEY,
        domain: process.env.EMAIL_DOMAIN
    }
}
let transporter = nodemailer.createTransport(mg(auth)

)
exports.regStaff = async (req, res, next) => {
    const { lastname, firstname, email } = req.body;
    //Generating fake password first..
    const password = Math.random().toString(36).slice(-8);

    try {
        const staff = await Staff.create({ lastname, firstname, email, password });
        upStaff = await Staff.findOne({ email });
        const resetToken = upStaff.getResetPasswordToken();
        await upStaff.save();
        const resetUrl = `http://localhost:3000/password-reset/${resetToken}`;
        const message = `
            <h1>We know you need your portal</h1>
            <p>Please go to this link to reset ur password.. </p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `;
        const mailOptions = {
            from: 'bellosamuel64@gmail.com',
            to: upStaff.email,
            subject: "Dr Aliyu wants you.",
            html: message
        }
        transporter.sendMail(mailOptions, function (err, data) {
            if (err) {
                return next(new ErrorResponse(err, 500));
            }
            else {
                res.status(200).json({ success: true, message: "Let your staff check the email provided in his mail and reset password for access to app.. if not found check spam.." })
            }
        })


    } catch (error) {
        next(error)
    }
}

exports.getStaffs = async (req, res, next) => {
    let staffs = [];
    try {
        staffs = await Staff.find({})
            .select('lastname')
            .select('firstname')
            .select('email')
            .populate({
                path: "loans",
                select: ['status', 'request_amount', 'request_message', 'request_date', 'sent_date']
            })
            ;
    } catch (error) {
        return next(new ErrorResponse(`Error found while fetching staffs.`, 500));
    }
    res.json({ success: true, staffs });
}

exports.getLoans = async (req, res, next) => {
    let loans = [];
    try {
        loans = await Loan.find({}).populate({ path: "staff_id", select: ['lastname', 'firstname', 'email'] });

    } catch (error) {
        return next(new ErrorResponse(`Error found while fetching staffs.`, 500));
    }
    res.json({ success: true, loans });
}

exports.updateLoanStatus = async (req, res, next) => {
    if (req.body.status) {
        const { status } = req.body;
        let loan_id = req.params.loan_id;
        try {
            const loan = await Loan.findById(loan_id);
            loan.status = status;
            if (status == "DISBURSED") {
                loan.sent_date = Date.now();
            }
            let staff_id = loan.staff_id;
            loan.save();
            try {
                const staff = await Staff.findById(staff_id);
                const { email } = staff;
                let message = `<p>Dear ${staff.lastname}</p>`;
                let subject = "";
                if (status == "ACCEPTED" || status == "DISBURSED") {
                    subject = "Your loan is approved"
                    message += ` <p>The money have been sent to the account you provided..</p>`;
                } else if (status == "REVIEWING") {
                    subject = "Your loan is being processed"
                    message += `<p>Well, i'm still thinking about disbursing the loan to you.</p>`;
                } else {
                    subject = "Your loan offer is rejected"
                    message += `<p>So sorry, you can not recieve the loan.</p>`;
                }
                const mailOptions = {
                    from: process.env.EMAIL_FROM,
                    to: email,
                    subject,
                    html: message
                }
                transporter.sendMail(mailOptions, function (err, data) {
                    if (err) {
                        return next(new ErrorResponse(err, 500));
                    }
                    else {
                        res.status(200).json({ success: true, message: "Loan updated successfully.." })
                    }
                })

            } catch (error) {

            }

        } catch (error) {
            return next(new ErrorResponse(`${error}`, 500));
        }
    }
    else {
        return next(new ErrorResponse(`Status can not be empty..`, 500));
    }

}