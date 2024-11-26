const mongoose = require("mongoose");
const { Schema } = mongoose;

const ModuleSchema = new Schema(
    {
        name: { type: String, required: true },
    });

const Module = mongoose.model("Module", ModuleSchema);

module.exports = Module;