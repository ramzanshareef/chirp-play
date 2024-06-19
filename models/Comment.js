import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        required: true,
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
    },
}, { timestamps: true });

export default mongoose.models.Comment || mongoose.model("Comment", commentSchema);