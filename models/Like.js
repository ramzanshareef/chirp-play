import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    contentID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "onModel",
    },
    onModel: {
        type: String,
        required: true,
        enum: ["Video", "Comment", "Chirp"],
    },
    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
}, { timestamps: true });

export default mongoose.models.Like || mongoose.model("Like", likeSchema);