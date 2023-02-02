const router = require('express').Router();
const categoryCtlr = require('../controllers/categoryCtlr');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');


router.route('/category')
    .get(categoryCtlr.getCategories)
    .post(auth, authAdmin, categoryCtlr.createCategory)

router.route('/category/:id')
    .delete(auth, authAdmin, categoryCtlr.deleteCategory)
    .put(auth, authAdmin, categoryCtlr.updateCategory)

module.exports = router    