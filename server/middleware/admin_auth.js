//To check jsonwebtoken in the header..

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const ErrorResponse = require('../utils/errorResponse');
exports.protectAdmin = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    }
    if (!token) {
        return next(new ErrorResponse("Not authorized to access route..", 401))
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return next(new ErrorResponse("No admin found for Id..", 404));
        }
        req.admin = admin;
        next();
    } catch (err) {
        return next(new ErrorResponse("Not authorized to access route."), 401);
    }
}