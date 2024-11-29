import { model, Schema } from "mongoose";
import { ProductInterface } from "../../../interface/productmodelInterface";

const productSchema = new Schema<ProductInterface>(
  {
    name: {
      type: String,
      required: [true, "product name is required"],
    },
    price: {
      type: Number,
      required: [true, "product price is required"],
    },
    size: {
      type: [String],
      required: [true, "size is required"],
    },
    color: {
      type: [String],
      required: [true, "color is required"],
    },
    brand: {
      type: String,
      required: [true, "brand is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    image: {
      type: String,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const ProductModel = model("product", productSchema);
export default ProductModel;
