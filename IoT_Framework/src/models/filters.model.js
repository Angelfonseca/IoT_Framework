const mongoose = require("mongoose");
const { Schema } = mongoose;
const ConditionSchema = new Schema(
  {
    condition: {
      type: String,
      required: true,
      enum: ["<", "<=", "=", ">=", ">"],
    },
    threshold: { type: Number, required: true },
  },
  { _id: false }
);

const FilterSchema = new Schema(
  {
    field: { type: String, required: true }, 
    conditions: [ConditionSchema], 
    device: { type: Schema.Types.ObjectId, ref: 'Device', required: true }, 
    module: { type: Schema.Types.ObjectId, ref: 'Module', required: true }, 
  },
  { timestamps: true }
);


module.exports = mongoose.model("Filter", FilterSchema);
