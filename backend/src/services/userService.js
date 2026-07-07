const User = require('../models/userModel');
const Order = require('../models/orderModel');

class UserService {
  async getAllUsers() {
    // Return all users sorted by name
    const users = await User.find().sort({ name: 1 });
    
    // Supplement each user with their calculated lifetime spend and order count
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const orders = await Order.find({ userId: user._id });
      const orderCount = orders.length;
      const lifetimeValue = orders.reduce((sum, order) => {
        if (order.paymentStatus === 'paid') {
          return sum + (order.totalAmount || 0);
        }
        return sum;
      }, 0);

      return {
        ...user.toObject(),
        orderCount,
        lifetimeValue
      };
    }));

    return usersWithStats;
  }

  async getUserById(id) {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid User ID must be provided.');
    }

    let user = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(id);
    }

    if (!user) {
      return null;
    }

    // Get order history and statistics
    const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });
    const orderCount = orders.length;
    const lifetimeValue = orders.reduce((sum, order) => {
      if (order.paymentStatus === 'paid') {
        return sum + (order.totalAmount || 0);
      }
      return sum;
    }, 0);

    return {
      ...user.toObject(),
      orders,
      orderCount,
      lifetimeValue
    };
  }

  async updateUserStatus(id, status) {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid User ID must be provided.');
    }

    if (!['active', 'suspended', 'inactive'].includes(status)) {
      throw new Error('Invalid status value provided.');
    }

    let user = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(id);
    }

    if (!user) {
      throw new Error('User not found in database.');
    }

    user.status = status;
    user.isActive = status === 'active';
    return await user.save();
  }
}

module.exports = new UserService();
