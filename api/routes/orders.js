const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')
const OrdersController = require('../controllers/orders')

router.get('/', checkAuth, OrdersController.orders_get_all)

router.get('/:orderID', checkAuth, OrdersController.orders_get_one)

router.post('/', checkAuth, OrdersController.orders_add_new)

router.delete('/:orderID', checkAuth, OrdersController.orders_delete_one)


module.exports = router