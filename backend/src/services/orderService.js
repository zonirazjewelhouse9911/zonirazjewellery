const Order = require('../models/orderModel');

class OrderService {
  async getAllOrders({ page, limit, status, userId } = {}) {
    let query = {};
    if (status) query.orderStatus = String(status).toLowerCase();
    if (userId) query.userId = userId;

    let queryBuilder = Order.find(query).sort({ createdAt: -1 }).lean();

    if (page && limit) {
      const pageNum = Math.max(1, Number(page));
      const limitNum = Math.max(1, Number(limit));
      const skip = (pageNum - 1) * limitNum;

      const [orders, total] = await Promise.all([
        queryBuilder.skip(skip).limit(limitNum),
        Order.countDocuments(query)
      ]);

      return {
        orders,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      };
    }

    return await queryBuilder;
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
