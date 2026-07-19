const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true, index: true },
    image: { type: String, required: true },
    images: { type: [String], default: [] },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    discountPercent: { type: Number, default: 0 },
    rating: { type: Number, default: 4 },
    ratingCount: { type: Number, default: 0 },
    stock: { type: Number, default: 20 },
  },
  { timestamps: true }
);

// Reshape a Mongo document into the exact object shape the React
// frontend's normalize() function used to produce, so ProductCard /
// ProductDetails / Shop don't need any changes.
productSchema.methods.toClientJSON = function () {
  return {
    id: this._id.toString(),
    title: this.title,
    category: this.category,
    image: this.image,
    images: this.images.length ? this.images : [this.image, this.image, this.image],
    description: this.description,
    price: this.price,
    oldPrice: this.oldPrice ?? Math.round(this.price * 1.15),
    discountPercent: this.discountPercent,
    rating: this.rating,
    ratingCount: this.ratingCount,
    stock: this.stock,
  };
};

module.exports = mongoose.model("Product", productSchema);
