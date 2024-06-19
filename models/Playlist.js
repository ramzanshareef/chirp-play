import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    description: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
    }],
}, { timestamps: true });

export default mongoose.models.Playlist || mongoose.model("Playlist", playlistSchema);