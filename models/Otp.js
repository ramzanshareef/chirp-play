const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    otp: {
        type: Number,
        required: true,
    },
});

export default mongoose.models.otp || mongoose.model("otp", otpSchema);