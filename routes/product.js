const express = require("express");
const router = express.Router();
const {
  test,
  addProduct,
  getProduct,
  adminGetAllProducts,
  GetOneProduct,
  AdminUpdateOneProduct,
  AdminDeleteOneProduct,
  addReview,
  deleteReview,
  allReview

} = require("../controllers/product_controller");
const { isLoggedIn, isAdmin } = require("../middleware/user_middleware");

router.route("/test").get(test);
router.route("/products").get(getProduct);
router.route("/product/:id").get(GetOneProduct);
router.route("/product/review/:id").put(isLoggedIn ,addReview);
router.route("/product/review/:id").delete( isLoggedIn ,deleteReview);
router.route("/product/allReview/:id").get( isLoggedIn,allReview);

// admin routes
router.route("/admin/addProduct").post(isLoggedIn, addProduct);


router
  .route("/admin/GetAllProducts")
  .get(isLoggedIn, isAdmin("admin"), adminGetAllProducts);


router
  .route("/admin/product/:id")
  .put(isLoggedIn, isAdmin("admin"), AdminUpdateOneProduct)
  .delete(isLoggedIn, isAdmin("admin"), AdminDeleteOneProduct);
module.exports = router;
