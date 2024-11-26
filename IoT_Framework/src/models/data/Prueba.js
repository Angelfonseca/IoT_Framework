
const mongoose = require('mongoose');
const PruebaSchema = new mongoose.Schema({
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
    test: { type: Object, properties: { gadgfe: { type: Number, required: true }, gaefge: { type: String, required: true } } }
}, { timestamps: true });

module.exports = mongoose.model('Prueba', PruebaSchema);
