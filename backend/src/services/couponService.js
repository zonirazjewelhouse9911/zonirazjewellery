const Coupon = require('../models/couponModel');

class CouponService {
  async getAllCoupons() {
    return await Coupon.find().sort({ createdAt: -1 });
  }

  async getCouponById(id) {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid Coupon ID must be provided.');
    }

    let coupon = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      coupon = await Coupon.findById(id);
    }
    if (!coupon) {
      coupon = await Coupon.findOne({ code: id.toUpperCase() });
    }
    return coupon;
  }

  async createCoupon(couponData) {
    if (!couponData.code || !couponData.discountType || couponData.discountValue === undefined) {
      throw new Error('Coupon code, discountType, and discountValue are required.');
    }

    const codeUpper = couponData.code.trim().toUpperCase();
    const existing = await Coupon.findOne({ code: codeUpper });
    if (existing) {
      throw new Error('Coupon code is already defined.');
    }

    const coupon = new Coupon({
      ...couponData,
      code: codeUpper
    });
    return await coupon.save();
  }

  async updateCoupon(id, updateData) {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid Coupon ID must be provided.');
    }

    let coupon = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      coupon = await Coupon.findById(id);
    }
    if (!coupon) {
      coupon = await Coupon.findOne({ code: id.toUpperCase() });
    }
    if (!coupon) {
      throw new Error('Coupon not found in database.');
    }

    // Check code uniqueness if updated
    if (updateData.code) {
      const codeUpper = updateData.code.trim().toUpperCase();
      if (codeUpper !== coupon.code) {
        const existing = await Coupon.findOne({ code: codeUpper });
        if (existing) {
          throw new Error('Coupon code is already defined on another coupon.');
        }
        coupon.code = codeUpper;
      }
    }

    // Assign other properties dynamically
    Object.keys(updateData).forEach(key => {
      if (key !== '_id' && key !== '__v' && key !== 'code') {
        coupon[key] = updateData[key];
      }
    });

    return await coupon.save();
  }
}

module.exports = new CouponService();
