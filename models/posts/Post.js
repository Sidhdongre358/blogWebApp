import mongoose from "mongoose";
import User from "../users/User.js";
import comment from "../comments/Comment.js";

// postSchema

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "react js",
        "html",
        "css",
        "node js",
        "javacript",
        "mongoDB",
        "other",
        "Web Development",
        "Tech Gadgets",
        "Business",
        "Health & Wellness",
      ],
    },
    image: {
      type: String,
      //  required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    comment: [{ type: mongoose.Schema.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

// postModel
const Post = mongoose.model("Post", postSchema);
export default Post;
