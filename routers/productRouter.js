const express = require("express");
const productController = require("../controllers/productController");
const { authenticated, adminOnly } = require("../middlewares/middleware");
const productRouter = express.Router();

//apply authenticated middleware to all of the productRouter's routes.
productRouter.use(authenticated)

productRouter.get("/products", productController.productsGet);
productRouter.post("/products", productController.productPost);
productRouter.get("/add-product", adminOnly, productController.addProduct);
productRouter.get("/find-products", adminOnly, productController.searchProduct);
productRouter.get("/products/:id/details", adminOnly, productController.productDetails);
productRouter.put("/products/:id", adminOnly, productController.updateProduct);
productRouter.delete("/products/:id", adminOnly, productController.deleteProduct);
productRouter.delete("/products/:id/delete", adminOnly, productController.softDeleteProduct);
productRouter.get("/products/:id/update", adminOnly, productController.updateProductGet);
module.exports = productRouter;