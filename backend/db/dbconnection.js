const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

exports.connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.Mongo_URI, {
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