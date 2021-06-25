const mongoose = require('mongoose');
const bcyrpt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    name: {
        type: String,
        required: [true, "Provide name.."]
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
})
// Check password before rehashing...
AdminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcyrpt.genSalt(10);
    this.password = await bcyrpt.hash(this.password, salt);
    next();
})
AdminSchema.methods.getSignedToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
}
AdminSchema.methods.matchPasswords = async function (password) {
    return await bcyrpt.compare(password, this.password);
}
module.exports = Admin = mongoose.model('Admin', AdminSchema);