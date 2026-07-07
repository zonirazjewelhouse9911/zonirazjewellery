const mongoose = require("mongoose");

const reveiwSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      star: {
        type: Number,
        default: 1
      },
      discription: {
        type: String,
        default: ""
      },
      images: [
        {
          type: String,
          default: ""
        }
      ]
    }
  ]
}, {
  timestamps: true
})

const Reveiw = mongoose.model("Reveiw", reveiwSchema);
module.exports = Reveiw;
