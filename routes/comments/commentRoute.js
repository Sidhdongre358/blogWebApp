import express from "express";
import commentCtrl from "../../controllers/comments/commentCtrl.js";
import { isProtected } from "../../middlewares/isProtected.js";
import Post from "../../models/posts/Post.js";
import Comment from "../../models/comments/Comment.js";

const commentRoute = express.Router();

commentRoute.get("/home", async (req, res) => {
  res.send("works! from commentRoute");
});

// Router to get comment update page
commentRoute.get(
  "/update-comment-form/:comment_Id/:post_Id",
  async (req, res) => {
    try {
      const commentId = req.params.comment_Id;
      const postId = req.params.post_Id;

      console.log(postId + "yes..." + commentId);

      const post = await Post.findById(postId);
      const comment = await Comment.findById(commentId);
      res.render("post-pages/updateComment", {
        comment,
        post,
        error: "",
      });
    } catch (error) {}
  }
);

// Create User
commentRoute.post("/:id", commentCtrl.createComment);

// Get all users

//commentRoute.get("/", commentCtrl.getAllComments);
// delete a user
commentRoute.delete(
  "/:postId/:commentId",
  isProtected,
  commentCtrl.deleteComment
);

// get a single user
//commentRoute.get("/:id", commentCtrl.getComment);
// update a user
commentRoute.put("/:postId/:commentId", isProtected, commentCtrl.updateComment);
export default commentRoute;
