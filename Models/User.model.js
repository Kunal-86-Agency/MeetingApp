const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({

    role: { type: String, enum: ["User", "Admin"], default: "User" },
    email: { type: String, required: true },
    password: { type: String, required: true },
    first_name: { type: String, require: true },
    last_name: { type: String, require: true },
    gender: { type: String, enum: ["male", "female", "others"], default: "male" },
    phone_number: { type: Number, require: true },
    alternate_phone_number: { type: Number },
    working_status: { type: String, enum: ["active", "inactive", "disabled"], default: "active" }, gender: { type: String },
    address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    profile_photo: { type: String },
    start_date: { type: String },
    aadhar_number: { type: Number },

}, { timestamps: true });

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;

