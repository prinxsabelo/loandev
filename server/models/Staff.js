const mongoose = require('mongoose');
const bcyrpt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");

const Schema = mongoose.Schema;

const StaffSchema = new Schema({
    lastname: {
        type: String,
        required: [true, "Provide lastname.."]
    },
    firstname: {
        type: String,
        required: [true, "Provide firstname.."]
    },
    email: {
        type: String,
        required: [true, "Provide email.."],
        unique: true,
        match: [
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
            "Provide valid email.."
        ]
    },
    password: {
        type: String,
        required: [true, "Provide Password.."],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    loans: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Loan"
    }]
})

// Check password before rehashing...
StaffSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcyrpt.genSalt(10);
    this.password = await bcyrpt.hash(this.password, salt);
    next();
});


StaffSchema.methods.getSignedToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
}
StaffSchema.methods.matchPasswords = async function (password) {
    return await bcyrpt.compare(password, this.password);
}

StaffSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000)
    return resetToken;
}

module.exports = Staff = mongoose.model('Staff', StaffSchema);