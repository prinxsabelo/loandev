const express = require('express');
const router = express.Router();

//staff can not create an acccount themselves but can only resetpassword..
const { resetPassword, login } = require('../controllers/staff/staff_auth');
// router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:resetToken').put(resetPassword);
router.route('/login').post(login);


module.exports = router;