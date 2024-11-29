import express from "express";
import { productApiController } from "../../app/module/webservice/ProductApiController";
import { productImage } from "../../app/helper/productImage";
import { authCheck } from "../../app/middleware/authHelper";

export const productRouter = express.Router();

productRouter.post(
  "/product/create",
  productImage.single("image"),
 authCheck, productApiController.createProduct
);
productRouter.get("/products",authCheck, productApiController.getProducts);
productRouter.get("/product/:id",authCheck, productApiController.productDetails);
productRouter.post(
  "/product/update/:id",
  productImage.single("image"),
 authCheck, productApiController.updateProduct
);
productRouter.get("/product/delete/:id",authCheck, productApiController.deleteProduct);
productRouter.get("/products/filter",authCheck, productApiController.filterProducts);
productRouter.get("/products/search/:keyword",authCheck, productApiController.search);
