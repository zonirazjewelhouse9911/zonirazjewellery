const Order = require('../../models/orderModel');
const walletService = require('../../services/walletService');

const mapToClientOrder = (mongoOrder) => ({
    id: mongoOrder._id,
    orderId: mongoOrder._id.toString().substring(0, 8).toUpperCase(), // friendly Order ID
    createdAt: mongoOrder.createdAt,
    grandTotal: mongoOrder.totalAmount,
    deliveryMethod: mongoOrder.deliveryMethod || (mongoOrder.shippingAddress?.addressLine?.toLowerCase().includes('pickup') ? 'pickup' : 'delivery'),
    storeDetails: mongoOrder.storeDetails || null,
    shippingAddress: mongoOrder.shippingAddress || null,
    digiGoldRedeemedAmount: mongoOrder.digiGoldRedeemedAmount || 0,
    orderStatus: mongoOrder.orderStatus || 'processing',
    paymentStatus: mongoOrder.paymentStatus || 'pending',
    OrderItems: (mongoOrder.items || []).map((item, idx) => ({
        id: item._id || idx,
        productId: item.productId,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
        goldPurity: item.configuration?.purity || '',
        diamondDetails: item.configuration?.stone || '',
        grossWeight: item.configuration?.grossWeight || item.grossWeight || item.gross_weight || 0,
        netWeight: item.configuration?.netWeight || item.netWeight || item.goldWeight || item.gold_weight || 0,
        configuration: item.configuration || null,
        customization: item.customization || null
    }))
});

exports.getOrders = async (req, res) => {
    try {
        const user_id = req.user._id;
        const orders = await Order.find({ userId: user_id }).sort({ createdAt: -1 });
        const clientOrders = orders.map(mapToClientOrder);
        return res.status(200).json(clientOrders);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { items, deliveryMethod, shippingFee, gstAmount, couponDiscount, grandTotal, deliveryEstimate, storeDetails, walletAmountUsed, shippingAddress, razorpayOrderId } = req.body;
        const user_id = req.user._id;

        const orderItems = (items || []).map(item => {
            let chosenSize = item.selectedSize || item.configuration?.size || '';
            if (!chosenSize && item.size && !String(item.size).includes(',')) {
                chosenSize = String(item.size);
            }

            const rawGross = item.grossWeight || item.gross_weight || item.configuration?.grossWeight || item.configuration?.gross_weight || item.product_weight || item.weight || 0;
            const rawNet = item.netWeight || item.net_weight || item.goldWeight || item.gold_weight || item.configuration?.netWeight || item.configuration?.goldWeight || item.gold_weight || 0;

            return {
                productId: item.productId || item.id,
                name: item.name,
                slug: item.slug || item.name.toLowerCase().replace(/ /g, '-'),
                price: Number(item.price) || 0,
                quantity: Number(item.quantity) || 1,
                image: item.image || null,
                configuration: {
                    metal: item.selectedMetal || item.metal || item.configuration?.metal || '',
                    purity: item.selectedPurity || item.purity || item.configuration?.purity || '18KT',
                    size: chosenSize,
                    stone: item.selectedStone || item.diamondDetails || item.stone || item.configuration?.stone || 'SI IJ',
                    grossWeight: Number(rawGross) || 0,
                    netWeight: Number(rawNet) || 0
                },
                customization: item.customization || null
            };
        });

        let finalShippingAddress = {};

        if (deliveryMethod === 'pickup') {
            finalShippingAddress = {
                fullName: (shippingAddress && shippingAddress.fullName) || req.user.user_name || req.user.name || 'Store Pickup Customer',
                phone: (shippingAddress && shippingAddress.phone) || req.user.phone_number || req.user.phone || '0000000000',
                addressLine: (storeDetails && storeDetails.address) ? `Store Pickup: ${storeDetails.name} (${storeDetails.address})` : 'Pickup from Store',
                city: (storeDetails && storeDetails.name) || 'Store Pickup',
                state: (storeDetails && storeDetails.pickupDate) ? `Date: ${storeDetails.pickupDate}` : 'Pickup',
                pincode: (storeDetails && storeDetails.pickupTime) ? `Time: ${storeDetails.pickupTime}` : '000000',
                country: 'India'
            };
        } else if (shippingAddress && (shippingAddress.addressLine || shippingAddress.streetAddress || shippingAddress.fullName)) {
            const addrLine = shippingAddress.addressLine || [shippingAddress.flatNumber, shippingAddress.streetAddress, shippingAddress.area, shippingAddress.landmark].filter(Boolean).join(', ') || 'Delivery Address';
            finalShippingAddress = {
                fullName: shippingAddress.fullName || req.user.user_name || req.user.name || 'Customer',
                phone: shippingAddress.phone || req.user.phone_number || req.user.phone || '0000000000',
                addressLine: addrLine,
                city: shippingAddress.city || 'City',
                state: shippingAddress.state || 'State',
                pincode: shippingAddress.pincode || '000000',
                country: shippingAddress.country || 'India'
            };
        } else if (storeDetails) {
            finalShippingAddress = {
                fullName: req.user.user_name || req.user.name || 'Store Pickup Customer',
                phone: req.user.phone_number || req.user.phone || '0000000000',
                addressLine: storeDetails.address ? `Store Pickup: ${storeDetails.name} (${storeDetails.address})` : 'Pickup from Store',
                city: storeDetails.name || 'Store Pickup',
                state: storeDetails.pickupDate ? `Date: ${storeDetails.pickupDate}` : 'Pickup',
                pincode: storeDetails.pickupTime ? `Time: ${storeDetails.pickupTime}` : '000000',
                country: 'India'
            };
        } else {
            finalShippingAddress = {
                fullName: req.user.user_name || req.user.name || 'Customer',
                phone: req.user.phone_number || req.user.phone || '0000000000',
                addressLine: 'Address Not Provided',
                city: 'N/A',
                state: 'N/A',
                pincode: '000000',
                country: 'India'
            };
        }

        const newOrder = new Order({
            userId: user_id,
            items: orderItems,
            totalAmount: grandTotal,
            digiGoldRedeemedAmount: Number(walletAmountUsed) || 0,
            deliveryMethod: deliveryMethod || (storeDetails ? 'pickup' : 'delivery'),
            storeDetails: storeDetails || null,
            shippingAddress: finalShippingAddress,
            razorpayOrderId: razorpayOrderId || req.body.razorpay_order_id || null,
            paymentStatus: 'paid', // Simulate success checkout
            orderStatus: 'processing'
        });

        await newOrder.save();

        if (walletAmountUsed && Number(walletAmountUsed) > 0 && req.user?.email) {
          try {
            await walletService.redeemWalletForOrder({
              userEmail: req.user.email,
              amount: Number(walletAmountUsed),
              orderId: newOrder._id
            });
          } catch (wErr) {
            console.error('Error redeeming wallet balance for order:', wErr);
          }
        }

        return res.status(201).json(mapToClientOrder(newOrder));
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};
