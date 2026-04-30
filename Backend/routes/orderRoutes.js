const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");
const Cart = require("../models/Cart");


// 🛒 Place Order (customer)
router.post("/", protect, async (req, res) => {
  try {
    const { items, address, paymentMethod, paymentStatus } = req.body;
    console.log("Incoming items:", items);
    const itemsWithVendor = [];

    // 🔥 Attach vendorId + status
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        console.log("❌ Product not found:", item.productId);
        return res.status(400).json({
          message: "Product not found",
        });
      }

      // ❌ Check stock
      if (product.stock < item.qty) {
        return res.status(400).json({
          message: `${product.name} is out of stock`,
        });
      }

      // ✅ Reduce stock
      product.stock -= item.qty;
      await product.save();

      itemsWithVendor.push({
        productId: item.productId,
        name: item.name,
        price: item.price,
        qty: item.qty,
        vendorId: product.vendorId,
        status: "pending", // ✅ FIXED
      });
    }
    console.log("Final itemsWithVendor:", itemsWithVendor);

    const totalAmount = itemsWithVendor.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    const order = new Order({
      userId: req.user.id,
      items: itemsWithVendor,
      totalAmount,
      address,
      paymentMethod,
      paymentStatus,
    });

    const saved = await order.save();

    // 🧹 clear cart
    await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { items: [] }
    );

    res.status(201).json(saved);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 🧑‍💼 Vendor → see ONLY their items
router.get("/vendor", protect, async (req, res) => {
  try {
    const orders = await Order.find({
      "items.vendorId": req.user.id,
    }).populate("userId", "name email");

    const active = [];
    const history = [];

    orders.forEach((order) => {
      const vendorItems = order.items.filter(
        (item) => item.vendorId.toString() === req.user.id
      );

      const allCompleted =
        vendorItems.length > 0 &&
        vendorItems.every((item) => item.status === "completed");

      const formattedOrder = {
        _id: order._id,
        user: order.userId,
        items: vendorItems,
        totalAmount: vendorItems.reduce(
          (sum, item) => sum + item.price * item.qty,
          0
        ),
        address: order.address,
        createdAt: order.createdAt,
      };

      if (allCompleted) {
        history.push(formattedOrder);
      } else {
        active.push(formattedOrder);
      }
    });

    res.json({ active, history });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 👤 Customer → see their orders
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.id,
    })
      .populate("items.vendorId", "name email")
      .sort({ createdAt: -1 });

    const formatted = orders.map((order) => {
      const allCompleted =
        order.items.length > 0 &&
        order.items.every((item) => item.status === "completed");

      return {
        ...order._doc,
        status: allCompleted ? "completed" : "pending",
      };
    });

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ Mark single item complete (vendor)
router.put("/:orderId/item/:productId", protect, async (req, res) => {
  try {
    const { orderId, productId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    let updated = false;

    order.items.forEach((item) => {
      if (
        item.productId.toString() === productId &&
        item.vendorId.toString() === req.user.id
      ) {
        item.status = "completed"; // ✅ FIXED SAFE UPDATE
        updated = true;
      }
    });

    if (!updated) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await order.save();

    res.json(order);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;