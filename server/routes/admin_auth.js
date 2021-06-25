const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/admin/admin_auth')
router.route('/register').post(register);
router.route('/login').post(login);



module.exports = router;