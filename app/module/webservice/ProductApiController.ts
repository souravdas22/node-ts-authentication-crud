import type { Request, Response } from "express";
import { productRepo } from "../product/repo/product.repo";
import fs from "fs";
import { ProductInterface } from "../../interface/productmodelInterface";
import { FilterQuery } from "../../interface/productControllerInterface";
class ProductApiController {
  async createProduct(req: Request, res: Response) {
    try {
      const { name, price, size, color, brand, description, image } = req.body;
      await productRepo.save({
        name,
        price,
        size,
        color,
        brand,
        description,
        image,
      });
      res.status(200).json({
        status: 200,
        message: "product created successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: `Internal server error: ${error}`,
      });
    }
  }
  async getProducts(req: Request, res: Response) {
    try {
      const products = await productRepo.getAll();
      res.status(200).json({
        status: 200,
        message: "Posts fetched successfully",
        data: products,
        total: products?.length,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: `Internal server error: ${error}`,
      });
    }
  }
  async productDetails(req: Request, res: Response) {
    try {
      const productId = req.params.id;

      const singleProduct = await productRepo.findProduct(productId);

      res.status(200).json({
        status: 200,
        message: "Product details successfully",
        data: singleProduct,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error,
      });
    }
  }
  async updateProduct(req: Request, res: Response) {
    try {
      const productId = req.params.id;
      const new_image = req.file ? req?.file?.path : null;
      const duplicateProduct = await productRepo.findProduct(productId);
      if (new_image && duplicateProduct?.image) {
        fs.unlinkSync(duplicateProduct?.image);
      }
      const { name, price, size, color, brand, description } = req.body;
      const productData: ProductInterface = {
        name,
        price,
        size,
        color,
        brand,
        description,
      };
      if (new_image) {
        productData.image = new_image;
      }
      const newProduct = await productRepo.edit(productData, productId);

      if (!newProduct) {
        res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({
        status: 200,
        message: "Product updated successfully",
        data: newProduct,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error,
      });
    }
  }
  async deleteProduct(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const product = await productRepo.delete(id);
      if (product && product?.image) {
        fs.unlinkSync(product?.image);
      }
      res.status(200).json({
        status: 200,
        message: "Product deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error,
      });
    }
  }
  async filterProducts(req: Request, res: Response) {
    try {
      const { sizes, colors, brand } = req.query;

      const match: FilterQuery = {};

      // Filter by sizes
      if (sizes) {
        console.log(sizes);
        const sizeArray = (sizes as string).split(",");
        match.size = { $in: sizeArray };
      }

      // Filter by color
      if (colors) {
        console.log(colors);
        const colorArray = (colors as string).split(",");
        match.color = { $in: colorArray };
      }

      // Filter by brand
      if (brand) {
        match.brand = brand as string;
      }

      const products = await productRepo.matchProduct(match);
      res.status(200).json({
        status: 200,
        message: "Products fetched successfully",
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: `Internal server error: ${error}`,
      });
    }
  }
  async search(req: Request, res: Response) {
    try {
      const keyword = req.params.keyword;
      if (!keyword) {
         res.status(400).json({ message: "Keyword is required" });
      }
      const searchData = await productRepo.searchProduct(keyword);

      if (!searchData?.length) {
         res
          .status(404)
          .json({ message: "No products found for the search term" });
      }

       res.status(200).json({
        message: "Products retrieved successfully",
        total: searchData?.length,
        data: searchData,
      });
    } catch (error) {
      console.error("Error during product search:", error);
       res.status(500).json({ message: "Server error" });
    }
  }
}
export const productApiController = new ProductApiController();
