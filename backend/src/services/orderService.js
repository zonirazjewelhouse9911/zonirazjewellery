const Order = require('../models/orderModel');

class OrderService {
  async getAllOrders() {
    // Sort by createdAt: -1 to show latest orders first using lean
    return await Order.find().sort({ createdAt: -1 }).lean();
  }

  async getOrderById(id) {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid Order ID must be provided.');
    }

    let order = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id).lean();
    }
    return order;
  }

  async updateOrderStatus(id, status) {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid Order ID must be provided.');
    }

    let order = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }

    if (!order) {
      throw new Error('Order not found in database.');
    }

    order.orderStatus = String(status).toLowerCase();
    return await order.save();
  }

  async updatePaymentStatus(id, status) {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid Order ID must be provided.');
    }

    let order = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }

    if (!order) {
      throw new Error('Order not found in database.');
    }

    order.paymentStatus = String(status).toLowerCase();
    return await order.save();
  }
}

module.exports = new OrderService();
