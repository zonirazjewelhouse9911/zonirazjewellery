const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

exports.connectDB = async () => {
  try {
    const mongoUri = process.env.Mongo_URI || process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("❌ CRITICAL: MongoDB URI not found in environment variables! Checked Mongo_URI, MONGO_URI, and MONGODB_URI.");
      return;
    }
    const conn = await mongoose.connect(mongoUri, {
      maxPoolSize: 50,
      minPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      autoIndex: true
    });
    if (conn) {
        console.log("Database connected successfully (Pool Size: 50/10)");
    }
    else{
        console.log("Database connection failed!");
    }
  } catch (error) {
    console.log("Database connection failed! ", error);
  }
};