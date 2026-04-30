const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const { protect } = require("../middleware/authMiddleware");


// ======================
// GET CART (WITH STOCK)
// ======================
router.get("/", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id })
      .populate("items.productId"); // 👈 get full product data

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    // Convert cart items into frontend-friendly format
    const itemsWithStock = cart.items
      .filter((item) => item.productId) // 👈 avoid deleted products crash
      .map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        qty: item.qty,
        stock: item.productId.stock, // 🔥 IMPORTANT FOR STOCK UI
        image: item.productId.image,
        description: item.productId.description,
      }));

    res.json({ items: itemsWithStock });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ======================
// ADD ITEM TO CART
// ======================
router.post("/add", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    const { productId, qty = 1 } = req.body;

    // Get product from DB
    const Product = require("../models/Product");
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find existing item in cart
    const existing = cart.items.find(
      (i) => i.productId.toString() === productId
    );

    const currentQty = existing ? existing.qty : 0;
    const newQty = currentQty + qty;

    // 🚨 STOCK CHECK (MAIN LOGIC)
    if (newQty > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} items available in stock`,
      });
    }

    // Add or update item
    if (existing) {
      existing.qty = newQty;
    } else {
      cart.items.push({
        productId,
        qty,
      });
    }

    await cart.save();

    res.json(cart);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ======================
// REMOVE ITEM FROM CART
// ======================
router.delete("/:id", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== req.params.id
    );

    await cart.save();

    res.json(cart);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;