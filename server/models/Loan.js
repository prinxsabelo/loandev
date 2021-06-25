const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LoanSchema = new Schema({
    status: {
        type: String,
        default: "PENDING"
    },
    request_date: {
        type: Date,
        default: Date.now()
    },
    request_message: {
        type: String
    },
    request_amount: {
        type: Number
    },
    sent_date: {
        type: Date,
        default: null
    },
    refunded_date: {
        type: Date,
        default: null
    },
    staff_id: {
        type: mongoose.Types.ObjectId,
        ref: "Staff"
    }

})
module.exports = Loan = mongoose.model('Loan', LoanSchema);