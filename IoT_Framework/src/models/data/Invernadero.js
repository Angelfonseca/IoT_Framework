const mongoose = require("mongoose");
const InvernaderoSchema = new mongoose.Schema(
  {
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
    device: { type: mongoose.Schema.Types.ObjectId, ref: "Device", required: true },
    Sensores: {
      type: Object,
      properties: {
        sensor: { type: String, required: true },
        pot: { type: Number, required: true },
        volt: { type: Number, required: true },
        amp: { type: Number, required: true },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invernadero", InvernaderoSchema);
