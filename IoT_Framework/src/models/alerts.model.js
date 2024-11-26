const mongoose = require('mongoose');
const { Schema } = mongoose;

const AlertSchema = new Schema({
    description: { type: String, required: true },
    device: { type: Schema.Types.ObjectId, ref: 'Device', required: true }, 
    module: { type: Schema.Types.ObjectId, ref: 'Module', required: true }, 
    seen: { type: Boolean, default: false },
    resolved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Alert', AlertSchema);

