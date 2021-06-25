const ErrorResponse = require('../../utils/errorResponse');
const Admin = require('../../models/Admin');

//Admin registration here.. 
exports.register = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const admin = await Admin.create({ name, email, password });
        sendToken(admin, 201, res);
    } catch (error) {
        next(error)
    }
}

//Admin login here..
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorResponse("Provide email and password..", 400));
    }
    try {
        const admin = await Admin.findOne({ email }).select("+password")
        if (!admin) {
            return next(new ErrorResponse("Invalid credentials.", 401));
        }
        const isMatch = await admin.matchPasswords(password);
        if (!isMatch) {
            return next(new ErrorResponse("Invalid credentials.", 401));
        }
        sendToken(admin, 201, res);
    } catch (error) {
        next(error)
    }
}

const sendToken = (admin, statusCode, res) => {
    const token = admin.getSignedToken();
    res.status(statusCode).json({ success: true, token })
}