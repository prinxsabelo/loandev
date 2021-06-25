const Staff = require('../../models/Staff');
const ErrorResponse = require('../../utils/errorResponse');
// const sendEmail = require('../../utils/sendEmail');
const crypto = require('crypto');

//Staff can reset password..
exports.resetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");
    try {
        const staff = await Staff.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } })
        if (!staff) {
            return next(new ErrorResponse("Invalid reset token..", 400));
        }
        staff.password = req.body.password;
        staff.resetPasswordToken = undefined;
        staff.resetPasswordExpire = undefined;
        await staff.save();
        return res.status(201).json({ success: true, data: "Password reset success.." })
    } catch (error) {
        next(error);
    }
}



//staff login here..
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorResponse("Provide email and password..", 400));
    }
    try {
        const staff = await Staff.findOne({ email }).select("+password")
        if (!staff) {
            return next(new ErrorResponse("Invalid credentials.", 401));
        }
        const isMatch = await staff.matchPasswords(password);
        if (!isMatch) {
            return next(new ErrorResponse("Invalid credentials.", 401));
        }
        sendToken(staff, 201, res);
    } catch (error) {
        next(error)
    }
}

const sendToken = (staff, statusCode, res) => {
    const token = staff.getSignedToken();
    res.status(statusCode).json({ success: true, token })
}




// Staff can confirm to forgot password..
// exports.forgotPassword = async (req, res, next) => {
//     const { email } = req.body;
//     try {
//         const staff = await Staff.findOne({ email });
//         if (!staff) {
//             return next(new ErrorResponse("email could not be sent..", 404));
//         }
//         const resetToken = staff.getResetPasswordToken();
//         await staff.save();
//         const resetUrl = `http://localhost:3000/password-reset/${resetToken}`;
//         const message = `
//             <h1>You have requested a password reset..</h1>
//             <p>Please go to this link to reset ur password.. </p>
//             <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
//         `
//         try {
//             await sendEmail({
//                 to: staff.email,
//                 subject: "Password reset request..",
//                 text: message
//             })
//             res.status(200).json({ success: true, data: "Visit your mail to confirm your password.." })
//         } catch (error) {
//             staff.resetPasswordToken = undefined;
//             staff.resetPasswordExpire = undefined;
//             await staff.save();
//             return next(new ErrorResponse(error, 500));
//             // return next(new ErrorResponse("email could not be sent..", 500));
//         }
//     } catch (error) {
//         next(error);
//     }
// }