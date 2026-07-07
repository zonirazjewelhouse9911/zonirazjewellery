const Coupon = require('../../models/couponModel');

exports.verifyCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ error: 'Coupon code is required' });

        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
        if (!coupon) return res.status(400).json({ error: 'Invalid coupon code' });

        if (coupon.expirationDate && new Date(coupon.expirationDate) < new Date()) {
            return res.status(400).json({ error: 'Coupon has expired' });
        }

        const value = coupon.discountType === 'percentage' ? (coupon.discountValue / 100) : coupon.discountValue;

        return res.status(200).json({
            valid: true,
            discountType: coupon.discountType === 'percentage' ? 'percentage' : 'flat',
            value: value
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};
