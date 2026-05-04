const Order = require('../models/Order');

// @desc  Create new order
// @route POST /api/orders
// @access Public
const createOrder = async (req, res, next) => {
  try {
    const { items, shipping, subtotal, shippingCost, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }

    const order = await Order.create({ items, shipping, subtotal, shippingCost, total });
    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc  Get all orders
// @route GET /api/orders
// @access Admin
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('items.product', 'name imageUrl');
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc  Get order by ID
// @route GET /api/orders/:id
// @access Public
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name imageUrl category');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc  Update order status
// @route PUT /api/orders/:id/status
// @access Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };
