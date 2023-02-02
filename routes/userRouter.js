const router = require('express').Router();
const userCtlr = require('../controllers/userCtlr')
const auth = require('../middleware/auth')

router.post('/register', userCtlr.register)

router.post('/login', userCtlr.login)

router.get('/logout', userCtlr.logout)

router.get('/refreshtoken', userCtlr.refreshToken)

router.get('/infor', auth, userCtlr.getUser)

router.patch('/addcart', auth, userCtlr.addCart)

router.get('/history', auth, userCtlr.history)

module.exports = router