const mongoose = require("mongoose");

const AddressSchema = mongoose.Schema({
    house_number: { type: String },
    landmark: { type: String },
    location: { type: String },
    address1: { type: String },
    address2: { type: String },
    city: { type: String },
    district: { type: String },
    pincode: { type: String },
    state: { type: String },
    country: { type: String, default: "India" },
}, { timestamps: true });

const AddressModel = mongoose.model("Address", AddressSchema);

module.exports = AddressModel;