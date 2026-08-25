const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false
});

// User Model
const User = sequelize.define('User', {
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  mobile: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false }
});

// Address Model
const Address = sequelize.define('Address', {
  fullName: { type: DataTypes.STRING, allowNull: false },
  mobile: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING },
  flatNumber: { type: DataTypes.STRING, allowNull: false },
  streetAddress: { type: DataTypes.STRING, allowNull: false },
  landmark: { type: DataTypes.STRING },
  area: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  state: { type: DataTypes.STRING, allowNull: false },
  country: { type: DataTypes.STRING, defaultValue: 'India' },
  pincode: { type: DataTypes.STRING, allowNull: false },
  isDefault: { type: DataTypes.BOOLEAN, defaultValue: false }
});

// Order Model
const Order = sequelize.define('Order', {
  orderId: { type: DataTypes.STRING, unique: true, allowNull: false },
  deliveryMethod: { type: DataTypes.STRING, allowNull: false }, // 'delivery' or 'pickup'
  shippingFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
  gstAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
  couponDiscount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
  grandTotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  paymentStatus: { type: DataTypes.STRING, defaultValue: 'Pending' }, // 'Pending', 'Success', 'Failed'
  paymentMethod: { type: DataTypes.STRING },
  deliveryEstimate: { type: DataTypes.STRING },
  // Store Pickup Details
  storeName: { type: DataTypes.STRING },
  storeAddress: { type: DataTypes.STRING },
  pickupDate: { type: DataTypes.STRING },
  pickupTime: { type: DataTypes.STRING }
});

// OrderItem Model
const OrderItem = sequelize.define('OrderItem', {
  productId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  goldPurity: { type: DataTypes.STRING },
  diamondDetails: { type: DataTypes.STRING }
});

// Relations
User.hasMany(Address, { onDelete: 'CASCADE' });
Address.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

Order.hasMany(OrderItem, { onDelete: 'CASCADE' });
OrderItem.belongsTo(Order);

module.exports = {
  sequelize,
  User,
  Address,
  Order,
  OrderItem
};
