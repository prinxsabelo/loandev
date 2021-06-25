//To check jsonwebtoken in the header..

const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');
const ErrorResponse = require('../utils/errorResponse');
exports.protectStaff = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    }
    if (!token) {
        return next(new ErrorResponse("Not authorized to access route..", 401))
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const staff = await Staff.findById(decoded.id);
        if (!staff) {
            return next(new ErrorResponse("No Staff found for Id..", 404));
        }
        req.Staff = Staff;
        next();
    } catch (err) {
        return next(new ErrorResponse("Not authorized to access route."), 401);
    }
}