const express = require("express");
const { productsGet, productPost, addProduct, searchProduct } = require("../controllers/productController");
const { authenticated, adminOnly } = require("../middlewares/middleware");
const productRouter = express.Router();

//apply authenticated middleware to all of the productRouter's routes.
productRouter.use(authenticated)

productRouter.get("/products", productsGet);
productRouter.post("/products", productPost);
productRouter.get("/add-product", adminOnly, addProduct);
productRouter.get("/find-products", adminOnly, searchProduct);
module.exports = productRouter;