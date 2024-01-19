import express from "express";
import postCtrl from "../../controllers/posts/postCtrl.js";
import { isProtected } from "../../middlewares/isProtected.js";
import storage from "../../config/cloudinary.js";
import multer from "multer";
import Post from "../../models/posts/post.js";

//instance of multer

const uploadPhoto = multer({ storage });
const postRoute = express.Router();

postRoute.get("/home", async (req, res) => {
  res.send("works! from post");
});

// get add post page
postRoute.get("/addPost-page", async (req, res) => {
  try {
    console.log("add post page ");
    res.render("post-pages/addPost", { error: "" });
  } catch (error) {}
});

// get post updaete form

postRoute.get("/update-post-form/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    console.log(post);

    res.render("post-pages/updatePost", { post, error: "" });
  } catch (error) {
    res.render("post-pages/updatePost", { post: "", error: error.message });
  }
});

// Create post
postRoute.post(
  "/",
  isProtected,
  uploadPhoto.single("post-img"),
  postCtrl.createPost
);

// Get all posts

postRoute.get("/", postCtrl.getAll);
// get a single post
postRoute.get("/:id", postCtrl.fetchSinglePost);
// update a post
postRoute.put(
  "/:id",
  isProtected,
  uploadPhoto.single("post-img"),
  postCtrl.updatePost
);
// delete a post
postRoute.delete("/:id", isProtected, postCtrl.deletePost);
export default postRoute;
