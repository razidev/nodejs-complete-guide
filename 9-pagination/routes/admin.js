const express = require('express');
const { check, body } = require('express-validator');
const router = express.Router();
const adminController = require('../controllers/admin');
const isAuth = require('../middlewares/is-auth');

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', [
    body('title', 'minimum 3 characters').isString().isLength({ min: 3 }).trim(),
    body('price', 'Price not valid').isFloat(),
    body('description', 'minimum 3 and maximum 200 characters').isLength({ min: 5, max: 200 }).trim()
], isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', [
    body('title', 'minimum 3 characters').isString().isLength({ min: 3 }).trim(),
    body('price', 'Price not valid').isFloat(),
    body('description', 'minimum 3 and maximum 200 characters').isLength({ min: 5, max: 200 }).trim()
], isAuth, adminController.postEditProduct);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;
