const couponService = require('../services/couponService');

class CouponController {
  getCoupons = async (req, res) => {
    try {
      const coupons = await couponService.getAllCoupons();
      return res.status(200).json({ success: true, data: coupons });
    } catch (error) {
      console.error('Get Coupons Controller Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve campaigns list' });
    }
  }

  getCouponById = async (req, res) => {
    try {
      const coupon = await couponService.getCouponById(req.params.id);
      if (!coupon) {
        return res.status(404).json({ success: false, message: 'Coupon not found in database' });
      }
      return res.status(200).json({ success: true, data: coupon });
    } catch (error) {
      console.error('Get Single Coupon Controller Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve coupon details' });
    }
  }

  createCoupon = async (req, res) => {
    try {
      const coupon = await couponService.createCoupon(req.body);
      return res.status(201).json({
        success: true,
        message: 'Coupon successfully initialized',
        data: coupon
      });
    } catch (error) {
      console.error('Create Coupon Controller Error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to create coupon' });
    }
  }

  updateCoupon = async (req, res) => {
    try {
      const coupon = await couponService.updateCoupon(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Coupon successfully updated',
        data: coupon
      });
    } catch (error) {
      console.error('Update Coupon Controller Error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to update coupon' });
    }
  }
}

module.exports = new CouponController();
