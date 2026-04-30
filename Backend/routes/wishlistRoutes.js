const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");
const { protect } = require("../middleware/authMiddleware");

// GET wishlist
router.get("/", protect, async (req, res) => {
  let wish = await Wishlist.findOne({ userId: req.user.id });

  if (!wish) {
    wish = await Wishlist.create({ userId: req.user.id, items: [] });
  }

  res.json(wish);
});

// TOGGLE wishlist
router.post("/toggle", protect, async (req, res) => {
  let wish = await Wishlist.findOne({ userId: req.user.id });

  if (!wish) {
    wish = await Wishlist.create({ userId: req.user.id, items: [] });
  }

  const item = req.body;

  const exists = wish.items.find(
    (i) => i.productId.toString() === item.productId
  );

  if (exists) {
    wish.items = wish.items.filter(
      (i) => i.productId.toString() !== item.productId
    );
  } else {
    wish.items.push(item);
  }

  await wish.save();
  res.json(wish);
});

module.exports = router;