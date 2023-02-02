const Payments = require('../models/paymentModel')

const paymentCtlr = { 
    getPayments: async (req, res) => {
        try {
            const payments = await Payments.find()
            res.json(payments)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = paymentCtlr