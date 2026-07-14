const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sequelize, User, Address, Order, OrderItem } = require('./db');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'zoniraz_super_secret_jwt_key_2026';

app.use(cors());
app.use(express.json());

// Token Verification Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// ----------------- AUTH ROUTE -----------------

app.post('/api/auth/register', async (req, res) => {
  const { firstName, lastName, email, mobile, password } = req.body;

  try {
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) return res.status(400).json({ error: 'Email already registered' });

    const existingMobile = await User.findOne({ where: { mobile } });
    if (existingMobile) return res.status(400).json({ error: 'Mobile number already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword
    });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, mobile: user.mobile }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { identifier, password } = req.body; // Can be email or mobile

  try {
    const user = await User.findOne({
      where: identifier.includes('@') ? { email: identifier } : { mobile: identifier }
    });

    if (!user) return res.status(400).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, mobile: user.mobile }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Profile
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  const { firstName, lastName, email, mobile } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.mobile = mobile || user.mobile;
    await user.save();

    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Account
app.delete('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    await User.destroy({ where: { id: req.user.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ----------------- ADDRESSES ROUTE -----------------

app.get('/api/addresses', authenticateToken, async (req, res) => {
  try {
    const addresses = await Address.findAll({ where: { UserId: req.user.id } });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/addresses', authenticateToken, async (req, res) => {
  try {
    const { isDefault } = req.body;
    if (isDefault) {
      // Set all other user addresses to not default
      await Address.update({ isDefault: false }, { where: { UserId: req.user.id } });
    }
    const address = await Address.create({ ...req.body, UserId: req.user.id });
    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/addresses/:id', authenticateToken, async (req, res) => {
  try {
    const { isDefault } = req.body;
    if (isDefault) {
      await Address.update({ isDefault: false }, { where: { UserId: req.user.id } });
    }
    await Address.update(req.body, { where: { id: req.params.id, UserId: req.user.id } });
    const updated = await Address.findByPk(req.params.id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/addresses/:id', authenticateToken, async (req, res) => {
  try {
    await Address.destroy({ where: { id: req.params.id, UserId: req.user.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ----------------- ORDERS ROUTE -----------------

app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { UserId: req.user.id },
      include: [OrderItem],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', authenticateToken, async (req, res) => {
  const { items, deliveryMethod, shippingFee, gstAmount, couponDiscount, grandTotal, deliveryEstimate, storeDetails } = req.body;
  const orderId = 'ZZN' + Math.floor(100000 + Math.random() * 900000);

  try {
    const order = await Order.create({
      orderId,
      deliveryMethod,
      shippingFee,
      gstAmount,
      couponDiscount,
      grandTotal,
      deliveryEstimate,
      paymentStatus: 'Success', // Simulate success checkout
      paymentMethod: 'UPI/Card',
      storeName: storeDetails?.name,
      storeAddress: storeDetails?.address,
      pickupDate: storeDetails?.pickupDate,
      pickupTime: storeDetails?.pickupTime,
      UserId: req.user.id
    });

    for (const item of items) {
      await OrderItem.create({
        productId: item.id,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
        goldPurity: item.selectedPurity || '18KT',
        diamondDetails: item.diamondDetails || 'SI IJ',
        OrderId: order.id
      });
    }

    const completedOrder = await Order.findByPk(order.id, { include: [OrderItem] });
    res.status(201).json(completedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ----------------- COUPONS ROUTE -----------------

app.post('/api/coupons/verify', (req, res) => {
  const { code } = req.body;
  const validCoupons = {
    'ZONIRAZ10': 0.10, // 10% Off
    'GOLDEN20': 0.20,  // 20% Off
    'WELCOME500': 500  // Flat ₹500 Off
  };

  const discount = validCoupons[code.toUpperCase()];
  if (discount !== undefined) {
    res.json({ valid: true, discountType: typeof discount === 'number' && discount < 1 ? 'percentage' : 'flat', value: discount });
  } else {
    res.status(400).json({ error: 'Invalid coupon code' });
  }
});


// ----------------- OTP ROUTE -----------------

app.post('/api/otp/send', (req, res) => {
  const { mobile } = req.body;
  res.json({ success: true, message: `OTP sent successfully to +91 ${mobile}` });
});

app.post('/api/otp/verify', (req, res) => {
  const { otp } = req.body;
  if (otp === '123456' || otp === '1234') { // Pre-approved mock OTPs
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid OTP code' });
  }
});


// Start server and sync DB
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Zoniraz Backend Server running at http://localhost:${PORT}`);
  });
});
