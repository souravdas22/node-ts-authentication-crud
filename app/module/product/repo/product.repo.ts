import { FilterQuery } from "../../../interface/productControllerInterface";
import { ProductInterface } from "../../../interface/productmodelInterface";
import ProductModel from "../model/product.model";


class ProductRepositories {
  async getAll() {
    try {
      const products = await ProductModel.find({ deleted: false });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
  async save(data: ProductInterface) {
    try {
      const newProduct = await ProductModel.create(data);
      return newProduct;
    } catch (error) {
      console.log(error);
    }
  }
  async edit(productData: ProductInterface, productId: string) {
    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        productId,
        productData,
        {
          new: true,
        }
      );
      return updatedProduct;
    } catch (error) {
      console.log(error);
    }
  }
  async delete(id: string) {
    try {
      const deletedProduct = await ProductModel.findByIdAndUpdate(id, {
        deleted: true,
      });
      return deletedProduct;
    } catch (error) {
      console.log(error);
    }
  }
  async findProduct(id: string) {
    try {
      const product = await ProductModel.findById(id);
      return product;
    } catch (error) {
      console.log(error);
    }
  }
  async matchProduct(match: FilterQuery) {
    try {
      const products = await ProductModel.aggregate([
        {
          $match: match,
        },
      ]);
      return products;
    } catch (error) {
      console.log(error)
    }
  }
  async searchProduct(keyword: string | number | string[]) {
    try {
      const product = await ProductModel.find({
        deleted: false,
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
          { brand: { $regex: keyword, $options: "i" } },
          { color: { $regex: keyword, $options: "i" } },
        ],
      });
      return product;
    } catch (error) {
      console.log(error);
    }
  }
}

export const productRepo = new ProductRepositories();
