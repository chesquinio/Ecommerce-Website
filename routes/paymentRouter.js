const router = require('express').Router()
const paymentCtlr = require('../controllers/paymentCtlr')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.route('/checkout')
    .get(auth, authAdmin, paymentCtlr.getPayments)

module.exports = router    