const express = require('express');
const router = express.Router();

//Register new staffs here for admin..
const { regStaff, getStaffs, getLoans, updateLoanStatus } = require('../controllers/admin/index');
router.route('/regstaff').post(regStaff);


router.route('/staffs').get(getStaffs);


router.route('/loans').get(getLoans);


router.route('/updateloan/:loan_id').put(updateLoanStatus);

module.exports = router;