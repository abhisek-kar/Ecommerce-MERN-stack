const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: { type: String, required: [true, ["password is required"]] },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    addresses: { type: [Schema.Types.Mixed] },

    name: { type: String },
    resetPasswordToken: { type: String, default: "" },
  },
  { timestamps: true }
);

const virtual = userSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model("Users", userSchema);
