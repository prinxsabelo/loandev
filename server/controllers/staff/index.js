const Staff = require('../../models/Staff');
const Loan = require('../../models/Loan');
const ErrorResponse = require('../../utils/errorResponse');
const mongoose = require('mongoose');

const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const auth = {
    auth: {
        api_key: process.env.EMAIL_API_KEY,
        domain: process.env.EMAIL_DOMAIN
    }
}
let transporter = nodemailer.createTransport(mg(auth))
const jwt = require('jsonwebtoken');

// Staff Requesting for loan here..
exports.requestLoan = async (req, res, next) => {
    const { request_message, request_amount, staff_id } = req.body;

    try {
        const newLoan = new Loan({
            request_message,
            request_amount,
            staff_id
        })
        let staff;
        try {
            staff = await Staff.findById(staff_id);
        } catch (error) {
            return next(new ErrorResponse("You can not request loan.", 500));
        }

        if (!staff) {
            return next(new ErrorResponse("You can not request loan..", 500));
        }

        //If staff is found.. then continue to create loan..
        try {
            const sess = await mongoose.startSession();
            sess.startTransaction();
            await newLoan.save({ session: sess });
            staff.loans.push(newLoan);
            await staff.save({ session: sess });
            await sess.commitTransaction();

            let message = `<p>Dear ${staff.lastname}</p>
                            <p>Your loan will be processed shortly
                            `;
            let subject = "You requested for loan";


            //Sending email here..
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: staff.email,
                subject,
                html: message
            }
            transporter.sendMail(mailOptions, function (err, data) {
                if (err) {
                    return next(new ErrorResponse(err, 500));
                }
                else {
                    res.status(200).json({ success: true, message: "Loan request was successful.. Response coming from admin soon.." })
                }
            })


        } catch (error) {
            return next(new ErrorResponse(`Your loan can not be processed..}`, 500));
        }
        res.status(201).json({ success: true, loan: newLoan });
    } catch (error) {

    }
}

// Getting all loans for staff here..
exports.getLoansByStaffId = async (req, res, next) => {
    const staff_id = req.params.staff_id;
    let staffWithLoans;
    try {
        staffWithLoans = await Staff.findById(staff_id).populate("loans");
    } catch (error) {
        return next(new ErrorResponse(`Your loan can not be processed..}`, 500));
    }
    res.json({
        success: true,
        loans: staffWithLoans.loans.map(loan =>
            loan.toObject({ getters: true })
        )
    });
}

//Staff can repay loan here..
exports.paybackLoan = async (req, res, next) => {
    const { loan_id } = req.body;
    try {
        const loan = await Loan.findById(loan_id);
        loan.status = "REFUNDED";
        loan.date = Date.now();
        loan.save();
        res.json({
            success: true, message: "Loan refunded sucessfully.."
        });
    } catch (error) {

    }
}

//Checking staff profile here.. 
exports.staffProfile = async (req, res, next) => {
    let token = req.body.token;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const staff = await Staff.findById(decoded.id).select(['lastname', 'firstname', 'email']);
        if (!staff) {
            return next(new ErrorResponse("No staff found for Id..", 404));
        }

        res.json({
            success: true,
            staff
        });
    } catch (err) {
        return next(new ErrorResponse(err), 401);
    }
}