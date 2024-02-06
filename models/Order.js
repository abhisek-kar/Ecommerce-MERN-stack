const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentMethods = {
  values: ["cash", "card"],
  message: "enum validator failed for payment Methods",
};
const orderSchema = new Schema(
  {
    items: { type: [Schema.Types.Mixed], required: true }, // array of products
    totalAmount: { type: Number },
    totalItems: { type: Number },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paymentMethod: { type: String, required: true, enum: paymentMethods },
    paymentStatus: { type: String, default: "pending" },
    status: { type: String, default: "pending" },
    selectedAddress: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

orderSchema.virtual("orderID").get(function () {
  return this._id;
});

module.exports = mongoose.model("Order", orderSchema);
