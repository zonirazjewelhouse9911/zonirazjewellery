const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Address = require('../models/address');

class UserService {
  async getAllUsers() {
    // Return all users sorted by name
    const users = await User.find().sort({ name: 1 });
    
    // Supplement each user with calculated lifetime spend, order count, and addresses
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const orders = await Order.find({ userId: user._id });
      const orderCount = orders.length;
      const lifetimeValue = orders.reduce((sum, order) => {
        if (order.paymentStatus === 'paid') {
          return sum + (order.totalAmount || 0);
        }
        return sum;
      }, 0);

      // Fetch saved profile addresses
      const addressDoc = await Address.findOne({ user_id: user._id });
      const savedAddresses = (addressDoc?.entries || []).map((e, idx) => ({
        fullName: e.name || user.name || user.userName || 'Customer',
        phone: String(e.mobile || user.phone || user.userPhone || ''),
        addressLine: [e.house_number, e.street_name, e.landmark].filter(Boolean).join(', ') || 'Address',
        city: e.city || 'N/A',
        state: e.state || 'N/A',
        pincode: String(e.zipcode || ''),
        country: 'India',
        isDefault: e.primary === 'true' || idx === 0
      }));

      // Collect shipping addresses from orders
      const orderAddresses = orders
        .map(o => o.shippingAddress)
        .filter(addr => addr && addr.addressLine && !addr.addressLine.includes('Pickup from Store') && !addr.addressLine.includes('Address Not Provided'));

      const combinedAddresses = [...savedAddresses];
      for (const oAddr of orderAddresses) {
        const exists = combinedAddresses.some(a => a.addressLine === oAddr.addressLine && a.pincode === oAddr.pincode);
        if (!exists) {
          combinedAddresses.push({
            fullName: oAddr.fullName || user.name || 'Customer',
            phone: oAddr.phone || user.phone || '',
            addressLine: oAddr.addressLine,
            city: oAddr.city || 'N/A',
            state: oAddr.state || 'N/A',
            pincode: oAddr.pincode || '000000',
            country: oAddr.country || 'India',
            isDefault: combinedAddresses.length === 0
          });
        }
      }

      return {
        ...user.toObject(),
        addresses: combinedAddresses,
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

    // Fetch saved profile addresses
    const addressDoc = await Address.findOne({ user_id: user._id });
    const savedAddresses = (addressDoc?.entries || []).map((e, idx) => ({
      fullName: e.name || user.name || user.userName || 'Customer',
      phone: String(e.mobile || user.phone || user.userPhone || ''),
      addressLine: [e.house_number, e.street_name, e.landmark].filter(Boolean).join(', ') || 'Address',
      city: e.city || 'N/A',
      state: e.state || 'N/A',
      pincode: String(e.zipcode || ''),
      country: 'India',
      isDefault: e.primary === 'true' || idx === 0
    }));

    // Collect shipping addresses from order history
    const orderAddresses = orders
      .map(o => o.shippingAddress)
      .filter(addr => addr && addr.addressLine && !addr.addressLine.includes('Pickup from Store') && !addr.addressLine.includes('Address Not Provided'));

    const combinedAddresses = [...savedAddresses];
    for (const oAddr of orderAddresses) {
      const exists = combinedAddresses.some(a => a.addressLine === oAddr.addressLine && a.pincode === oAddr.pincode);
      if (!exists) {
        combinedAddresses.push({
          fullName: oAddr.fullName || user.name || 'Customer',
          phone: oAddr.phone || user.phone || '',
          addressLine: oAddr.addressLine,
          city: oAddr.city || 'N/A',
          state: oAddr.state || 'N/A',
          pincode: oAddr.pincode || '000000',
          country: oAddr.country || 'India',
          isDefault: combinedAddresses.length === 0
        });
      }
    }

    return {
      ...user.toObject(),
      addresses: combinedAddresses,
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
