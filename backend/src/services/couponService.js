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

  async sendWhatsAppCoupon({ couponId, targetUserIds, customMessage }) {
    const User = require('../models/userModel');
    const coupon = await this.getCouponById(couponId);
    if (!coupon) {
      throw new Error('Target coupon not found');
    }

    let query = {};
    if (Array.isArray(targetUserIds) && targetUserIds.length > 0) {
      query = { _id: { $in: targetUserIds } };
    }

    const users = await User.find(query).select('user_name phone_number email').lean();
    
    const whatsappGatewayService = require('./whatsappGatewayService');

    const formattedList = await Promise.all(users.map(async user => {
      const name = user.user_name || 'Valued Customer';
      const phone = String(user.phone_number || '').replace(/\D/g, '');
      const defaultText = `✨ *Exclusive Gift from Zoniraz Jewels!* 💎\n\nHello ${name},\nUse promo code *${coupon.code}* on your next purchase to get *${coupon.discountValue}${coupon.discountType === 'percentage' ? '%' : ' ₹'} OFF*!\n\nRedeem now: http://localhost:5173/#checkout`;
      const textToUse = customMessage 
        ? customMessage.replace('{userName}', name).replace('{couponCode}', coupon.code).replace('{discountValue}', coupon.discountValue)
        : defaultText;
      
      const cleanPhone = phone.length === 10 ? `91${phone}` : phone;
      
      // Auto-Send directly from Server (No WhatsApp Web or browser login needed!)
      const dispatchResult = await whatsappGatewayService.sendMessage({
        phone: cleanPhone,
        message: textToUse
      });

      const waUrl = cleanPhone 
        ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(textToUse)}`
        : null;

      return {
        userId: user._id,
        name,
        phone: user.phone_number,
        status: dispatchResult.success ? 'SENT_VIA_API' : 'FAILED',
        waUrl
      };
    }));

    return {
      couponCode: coupon.code,
      discountValue: coupon.discountValue,
      discountType: coupon.discountType,
      totalUsers: formattedList.length,
      sentViaServerApi: true,
      userBroadcasts: formattedList
    };
  }
}

module.exports = new CouponService();
