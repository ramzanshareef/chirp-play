import mongoose from "mongoose";

const chirpSchema = new mongoose.Schema({
    content: {
        required: true,
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });

export default mongoose.models.Chirp || mongoose.model("Chirp", chirpSchema);