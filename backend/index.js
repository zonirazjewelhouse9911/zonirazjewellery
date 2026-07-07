const cookieParser = require('cookie-parser');
const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');
const { connectDB } = require('./db/dbconnection.js');

// Load environment variables from .env file
dotenv.config();

const app = express();




// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:5178',
  'http://localhost:5179',
  'http://localhost:5180',
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS policy: This origin is not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With']
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Allow embedding public files (TC PDFs) in iframes from the dev frontend origins
app.use((req, res, next) => {
  // Use Content-Security-Policy frame-ancestors for modern browsers
  res.setHeader(
    'Content-Security-Policy',
    "frame-ancestors 'self' http://localhost:5173 http://localhost:5174 http://localhost:5175"
  );
  // Also clear any existing X-Frame-Options header that might block embedding
  res.removeHeader && res.removeHeader('X-Frame-Options');
  next();
});

// Middleware setup
// Stripe webhook needs raw body for signature verification
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Product catalog and file upload API routes
const productRoutes = require('./src/routes/productRoutes');
app.use('/api', productRoutes);

// Order transaction API routes
const orderRoutes = require('./src/routes/orderRoutes');
app.use('/api', orderRoutes);

// Category configuration API routes
const categoryRoutes = require('./src/routes/categoryRoutes');
app.use('/api', categoryRoutes);

// Hero Section Banner API routes
const bannerRoutes = require('./src/routes/bannerRoutes');
app.use('/api', bannerRoutes);

// User/Patron account API routes
const userRoutes = require('./src/routes/userRoutes');
app.use('/api', userRoutes);

// Editorial Collection API routes
const collectionRoutes = require('./src/routes/collectionRoutes');
app.use('/api', collectionRoutes);

// Campaign Coupon API routes
const couponRoutes = require('./src/routes/couponRoutes');
app.use('/api', couponRoutes);

// Exchange Program Inquiries API routes
const exchangeInquiryRoutes = require('./src/routes/exchangeInquiryRoutes');
app.use('/api', exchangeInquiryRoutes);

// Sell Gold Program Inquiries API routes
const sellGoldInquiryRoutes = require('./src/routes/sellGoldInquiryRoutes');
app.use('/api', sellGoldInquiryRoutes);

// navBar 
const navBarRoutes = require('./src/routes/userSide/navebar');
app.use('/api/userSide', navBarRoutes);

// collection 
const getcollectionRoutes = require('./src/routes/userSide/collection');
app.use('/api/userSide', getcollectionRoutes);

// review
const reviewRoutes = require('./src/routes/userSide/review');
app.use('/api/userSide', reviewRoutes);

// similar products
const similarProductsRoutes = require('./src/routes/userSide/similarProducts');
app.use('/api/userSide', similarProductsRoutes);

// user validation
const userValidationRoutes = require('./src/routes/userSide/user_validation');
app.use('/api/userSide', userValidationRoutes);

// address
const addressRoutes = require('./src/routes/userSide/address');
app.use('/api/userSide', addressRoutes);

// customision
const customisionRoutes = require('./src/routes/userSide/customision');
app.use('/api/userSide', customisionRoutes);

// frontend integration routes
const frontendRoutes = require('./src/routes/userSide/frontendRoutes');
app.use('/api', frontendRoutes);

// Setup Socket.IO using the utility
// const server = http.createServer(app);
// const socketUtil = require('./socket');
// const io = socketUtil.init(server);

// io.on('connection', (socket) => {
//   console.log(`Client connected: ${socket.id}`);
// });

// Setup view engine
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

// Connect to database and start server
connectDB();

// Initialize cron jobs
// const { initCronJobs } = require('./src/utils/cronJobs');
// initCronJobs();

app.listen(process.env.PORT || 55000, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT || 55000}`);
});
