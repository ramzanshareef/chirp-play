import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v); // validator for email
            },
            message: (props) => `${props.value} is not a valid email address`,
        },
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8,
    },
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
        trim: true,
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/cloudformedia/image/upload/chirp-play/avatar-default.jpg"
    },
    coverImage: {
        type: String,
        default: "https://res.cloudinary.com/cloudformedia/image/upload/chirp-play/coverimage-default.png"
    },
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
        },
    ]
}, {
    timestamps: true,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);