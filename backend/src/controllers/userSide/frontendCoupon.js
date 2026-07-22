const Coupon = require('../../models/couponModel');

// Verify a promo/coupon code entered by user
exports.verifyCoupon = async (req, res) => {
    try {
        const { code, subtotal = 0 } = req.body;
        if (!code) return res.status(400).json({ error: 'Coupon code is required' });

        const cleanCode = String(code).trim().toUpperCase();
        const coupon = await Coupon.findOne({ code: cleanCode, isActive: true });

        if (!coupon) {
            return res.status(400).json({ error: 'Invalid or inactive coupon code' });
        }

        if (coupon.expirationDate && new Date(coupon.expirationDate) < new Date()) {
            return res.status(400).json({ error: 'This coupon code has expired' });
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ error: 'Coupon usage limit reached' });
        }

        if (coupon.minCartValue && subtotal > 0 && subtotal < coupon.minCartValue) {
            return res.status(400).json({ 
                error: `Minimum order subtotal for this coupon is ₹${coupon.minCartValue.toLocaleString('en-IN')}` 
            });
        }

        return res.status(200).json({
            valid: true,
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minCartValue: coupon.minCartValue || 0,
            message: coupon.discountType === 'percentage' 
              ? `${coupon.discountValue}% OFF applied successfully!` 
              : `₹${coupon.discountValue} OFF applied successfully!`
        });
    } catch (error) {
        console.error('Verify Coupon Error:', error);
        return res.status(500).json({ error: error.message || 'Error verifying coupon' });
    }
};

// Fetch all active available offers set by admin for display in frontend cart/checkout
exports.getAvailableCoupons = async (req, res) => {
    try {
        const now = new Date();
        const coupons = await Coupon.find({
            isActive: true,
            $or: [
                { expirationDate: { $gt: now } },
                { expirationDate: null },
                { expirationDate: { $exists: false } }
            ]
        }).select('code discountType discountValue minCartValue expirationDate').lean();

        return res.status(200).json({
            success: true,
            data: coupons || []
        });
    } catch (error) {
        console.error('Get Available Coupons Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch available coupons' });
    }
};
