require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/Product");
const products = require("./products.data");

const run = async () => {
  await connectDB();

  if (process.argv.includes("--destroy")) {
    await Product.deleteMany();
    console.log("All products removed.");
    process.exit();
  }

  await Product.deleteMany();
  await Product.insertMany(products);
  console.log(`${products.length} products seeded.`);
  process.exit();
};

run().catch((err) => {
  console.error(err);
  mongoose.connection.close();
  process.exit(1);
});
