const express = require("express");
const router = express.Router();
const { createOrder, orderInfo , userOrder , allOrders, adminUpdate , deleteOrder} = require("../controllers/order_controller");
const { isLoggedIn, isAdmin } = require("../middleware/user_middleware");


router.route("/order/create").post(isLoggedIn, createOrder);
router.route("/order/:id").get(isLoggedIn, orderInfo);
router.route("/myorder").get(isLoggedIn , userOrder);


router.route("/admin/order").get(isLoggedIn , isAdmin('admin') , allOrders);
router.route("/admin/order/:id").put(isLoggedIn , isAdmin('admin') , adminUpdate)
.delete(isLoggedIn , isAdmin('admin') , deleteOrder);

module.exports =router;