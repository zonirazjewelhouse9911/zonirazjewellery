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
  'https://admin.zoniraz.in',
  'http://zoniraz.in',
  'https://zoniraz.com',
  'https://www.zoniraz.com',
  'zoniraz.in',
  'www.zoniraz.in',
  'https://zoniraz.in',
  'https://www.zoniraz.in',
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
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      origin.includes('zoniraz') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes('onrender.com')
    ) {
      return callback(null, true);
    } else {
      return callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With']
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Allow embedding public files in iframes
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "frame-ancestors 'self' http://localhost:5173 http://localhost:5174 http://localhost:5175"
  );
  res.removeHeader && res.removeHeader('X-Frame-Options');
  next();
});

// Stripe webhook needs raw body
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// API Routes
const productRoutes = require('./src/routes/productRoutes');
app.use('/api', productRoutes);

const orderRoutes = require('./src/routes/orderRoutes');
app.use('/api', orderRoutes);

const categoryRoutes = require('./src/routes/categoryRoutes');
app.use('/api', categoryRoutes);

const bannerRoutes = require('./src/routes/bannerRoutes');
app.use('/api', bannerRoutes);

const userRoutes = require('./src/routes/userRoutes');
app.use('/api', userRoutes);

const collectionRoutes = require('./src/routes/collectionRoutes');
app.use('/api', collectionRoutes);

const couponRoutes = require('./src/routes/couponRoutes');
app.use('/api', couponRoutes);

const exchangeInquiryRoutes = require('./src/routes/exchangeInquiryRoutes');
app.use('/api', exchangeInquiryRoutes);

const sellGoldInquiryRoutes = require('./src/routes/sellGoldInquiryRoutes');
app.use('/api', sellGoldInquiryRoutes);

const navBarRoutes = require('./src/routes/userSide/navebar');
app.use('/api/userSide', navBarRoutes);

const getcollectionRoutes = require('./src/routes/userSide/collection');
app.use('/api/userSide', getcollectionRoutes);

const reviewRoutes = require('./src/routes/userSide/review');
app.use('/api/userSide', reviewRoutes);

const similarProductsRoutes = require('./src/routes/userSide/similarProducts');
app.use('/api/userSide', similarProductsRoutes);

const trendingProductsRoutes = require('./src/routes/userSide/trendingProducts');
app.use('/api/userSide', trendingProductsRoutes);
app.use('/api', trendingProductsRoutes);

const userValidationRoutes = require('./src/routes/userSide/user_validation');
app.use('/api/userSide', userValidationRoutes);

const addressRoutes = require('./src/routes/userSide/address');
app.use('/api/userSide', addressRoutes);

const customisionRoutes = require('./src/routes/userSide/customision');
app.use('/api/userSide', customisionRoutes);

const frontendRoutes = require('./src/routes/userSide/frontendRoutes');
app.use('/api', frontendRoutes);

const productPricingRoutes = require('./src/routes/productPriceCalculation');
app.use('/api', productPricingRoutes);

const jewelleryPricingRoutes = require('./src/routes/jewelleryPricing');
app.use('/api', jewelleryPricingRoutes);

const basePricingRoutes = require('./src/routes/basePricing');
app.use('/api', basePricingRoutes);

// ─── Video Call Admin Status REST endpoint ────────────────────────────────────
// Track online admins in memory (socketId -> adminInfo)
const onlineAdmins = new Map();

app.get('/api/video-call/admin-status', (req, res) => {
  res.json({ online: onlineAdmins.size > 0, count: onlineAdmins.size });
});
// ─────────────────────────────────────────────────────────────────────────────

// Setup view engine
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

// ─── HTTP server + Socket.IO ──────────────────────────────────────────────────
const server = http.createServer(app);

const io = new socketIo.Server(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // ── Admin goes online ──────────────────────────────────────────────────────
  socket.on('admin:go-online', (data) => {
    onlineAdmins.set(socket.id, { socketId: socket.id, name: data?.name || 'Store Advisor' });
    console.log(`Admin online: ${socket.id} | Total: ${onlineAdmins.size}`);
    io.emit('admin-status', { online: true, count: onlineAdmins.size });
  });

  // ── Admin goes offline ─────────────────────────────────────────────────────
  socket.on('admin:go-offline', () => {
    onlineAdmins.delete(socket.id);
    console.log(`Admin offline: ${socket.id} | Remaining: ${onlineAdmins.size}`);
    io.emit('admin-status', { online: onlineAdmins.size > 0, count: onlineAdmins.size });
  });

  // ── User initiates a call — relay offer to ONE available admin ─────────────
  socket.on('user:call-admin', (data) => {
    if (onlineAdmins.size === 0) {
      socket.emit('call:admin-offline');
      return;
    }
    const [adminSocketId] = onlineAdmins.keys();
    console.log(`User ${socket.id} calling admin ${adminSocketId}`);
    io.to(adminSocketId).emit('incoming-call', {
      from: socket.id,
      offer: data.offer,
      product: data.product,
    });
  });

  // ── Admin answers call — relay answer back to user ─────────────────────────
  socket.on('admin:answer', (data) => {
    console.log(`Admin ${socket.id} answered, relaying to user ${data.to}`);
    io.to(data.to).emit('call:answered', { answer: data.answer });
  });

  // ── Admin declines call ────────────────────────────────────────────────────
  socket.on('admin:decline', (data) => {
    io.to(data.to).emit('call:declined');
  });

  // ── Relay ICE candidates between peers ────────────────────────────────────
  socket.on('webrtc:ice-candidate', (data) => {
    io.to(data.to).emit('webrtc:ice-candidate', {
      from: socket.id,
      candidate: data.candidate,
    });
  });

  // ── Either side ends the call ──────────────────────────────────────────────
  socket.on('call:end', (data) => {
    if (data?.to) {
      io.to(data.to).emit('call:ended');
    }
  });

  // ── Auto-cleanup on disconnect ─────────────────────────────────────────────
  socket.on('disconnect', () => {
    if (onlineAdmins.has(socket.id)) {
      onlineAdmins.delete(socket.id);
      io.emit('admin-status', { online: onlineAdmins.size > 0, count: onlineAdmins.size });
      console.log(`Admin disconnected: ${socket.id} | Remaining: ${onlineAdmins.size}`);
    }
    console.log(`Socket disconnected: ${socket.id}`);
  });
});
// ─────────────────────────────────────────────────────────────────────────────

// Connect to database and start server
connectDB();

server.listen(process.env.PORT || 55000, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT || 55000}`);
});
