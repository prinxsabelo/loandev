const express = require('express');
const router = express.Router();

const { staffProfile, requestLoan, paybackLoan, getLoansByStaffId } = require("../controllers/staff/index");

router.route('/profile').post(staffProfile);
router.route('/requestloan').post(requestLoan);
router.route('/staffloans/:staff_id').get(getLoansByStaffId);
router.route('/paybackloan').put(paybackLoan);

module.exports = router;