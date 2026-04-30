const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");


// 🛒 PUBLIC - Get ALL products (for customers)
router.get("/all", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 🧑‍💼 PRIVATE - Get vendor's own products
router.get("/", protect, async (req, res) => {
  try {
    const products = await Product.find({
      vendorId: req.user.id,
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 🔍 Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ➕ Add product (vendor only)
router.post("/", protect, async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      vendorId: req.user.id,
      image: req.body.image || undefined, // default fallback
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// ✏️ Update product (only owner)
router.put("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.vendorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ❌ Delete product (only owner)
router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Not found" });
    }

    if (product.vendorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await product.deleteOne();

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;