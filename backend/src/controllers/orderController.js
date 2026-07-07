const orderService = require('../services/orderService');

class OrderController {
  getOrders = async (req, res) => {
    try {
      const orders = await orderService.getAllOrders();
      return res.status(200).json({ success: true, data: orders });
    } catch (error) {
      console.error('Get Orders Controller Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch order history' });
    }
  }

  getOrderById = async (req, res) => {
    try {
      const order = await orderService.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found in database' });
      }
      return res.status(200).json({ success: true, data: order });
    } catch (error) {
      console.error('Get Order Detail Controller Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve order details' });
    }
  }

  updateOrderStatus = async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required' });
      }
      const order = await orderService.updateOrderStatus(req.params.id, status);
      return res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        data: order
      });
    } catch (error) {
      console.error('Update Order Status Controller Error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to update order status' });
    }
  }

  updatePaymentStatus = async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required' });
      }
      const order = await orderService.updatePaymentStatus(req.params.id, status);
      return res.status(200).json({
        success: true,
        message: 'Payment status updated successfully',
        data: order
      });
    } catch (error) {
      console.error('Update Payment Status Controller Error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to update payment status' });
    }
  }
}

module.exports = new OrderController();
