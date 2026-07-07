const Order = require('../../models/orderModel');

const mapToClientOrder = (mongoOrder) => ({
    id: mongoOrder._id,
    orderId: mongoOrder._id.toString().substring(0, 8).toUpperCase(), // friendly Order ID
    createdAt: mongoOrder.createdAt,
    grandTotal: mongoOrder.totalAmount,
    deliveryMethod: 'delivery',
    OrderItems: (mongoOrder.items || []).map((item, idx) => ({
        id: item._id || idx,
        productId: item.productId,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
        goldPurity: item.configuration?.purity || '',
        diamondDetails: item.configuration?.stone || ''
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
        const { items, deliveryMethod, shippingFee, gstAmount, couponDiscount, grandTotal, deliveryEstimate, storeDetails } = req.body;
        const user_id = req.user._id;

        const orderItems = (items || []).map(item => ({
            productId: item.productId || item.id,
            name: item.name,
            slug: item.slug || item.name.toLowerCase().replace(/ /g, '-'),
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || 1,
            image: item.image || null,
            configuration: {
                metal: item.selectedMetal || '',
                purity: item.selectedPurity || '18KT',
                size: item.selectedSize || '',
                stone: item.selectedStone || item.diamondDetails || 'SI IJ'
            }
        }));

        const newOrder = new Order({
            userId: user_id,
            items: orderItems,
            totalAmount: grandTotal,
            shippingAddress: {
                fullName: req.user.user_name || req.user.name || 'User',
                phone: req.user.phone_number || req.user.phone || '0000000000',
                addressLine: storeDetails?.address || 'Pickup from Store',
                city: storeDetails?.name || 'Pickup',
                state: 'State',
                pincode: '000000'
            },
            paymentStatus: 'paid', // Simulate success checkout
            orderStatus: 'pending'
        });

        await newOrder.save();

        return res.status(201).json(mapToClientOrder(newOrder));
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};
