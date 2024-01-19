import mongoose from "mongoose";
import Post from "../posts/post.js";

// userSchema
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String, // optional
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-erUOQght_VvS9h9OS_0J6wvFFIQHtIRgGjv-e1RBZ3fP02XlcM59WPkFb9cN-0U2uik&usqp=CAU",
    },
    coverImage: {
      type: String, // optional
    },
    role: {
      type: String, // optional
      default: "web developer ",
    },

    bio: {
      type: String, // optional
      default: "Good learner",
    },

    post: [{ type: mongoose.Schema.ObjectId, ref: "Post" }],
    comment: [{ type: mongoose.Schema.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

// userModel
const User = mongoose.model("User", userSchema);

export default User;
