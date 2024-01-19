import Comment from "../../models/comments/Comment.js";
import Post from "../../models/posts/Post.js";
import User from "../../models/users/User.js";
import {
  validateId,
  handleServerError,
  handleSuccess,
} from "../../utils/commonFunction.js";

// create / add comment
const createComment = async (req, res) => {
  const { message } = req.body;
  console.log(message);

  try {
    const postId = req.params.id;
    const userId = req.session.userAuth;
    // create comment
    const commentCreated = await Comment.create({ user: userId, message });
    // 1. check user and post
    const postFound = await Post.findById(postId);
    const user = await User.findById(userId);
    // add comment into user's and post's  comment's array
    postFound.comment.unshift(commentCreated._id);
    await postFound.save({ validateBeforeSave: false });
    user.comment.unshift(commentCreated._id);
    await user.save({ validateBeforeSave: false });
    // making validation before save false so mongo should not throw validation error
    const post = await Post.findById(postId)
      .populate("user")
      .populate({
        path: "comment",
        populate: { path: "user" },
      });

    res.render("post-pages/postDetails", { post });
  } catch (error) {
    handleServerError(res, "Failed to create Comment.");
  }
};

// get all comments // not required
const getAllComments = async (req, res) => {
  try {
    handleSuccess(res, "All Comment details.");
  } catch (error) {
    handleServerError(res, "Failed to get all Comment details.");
  }
};

// get a comment
const getComment = async (req, res) => {
  try {
    const id = req.params.id;
    if (validateId(id, res)) {
      handleSuccess(res, `Comment found with ID ${id}`);
    }
  } catch (error) {
    handleServerError(res, "Failed to get Comment details.");
  }
};

//Update a comment
const updateComment = async (req, res) => {
  const { message } = req.body;

  try {
    const commentId = req.params.commentId;
    const postId = req.params.postId;
    console.log(commentId);
    console.log(postId);
    const userId = req.session.userAuth;

    // find comment
    const comment = await Comment.findById(commentId);

    // find same user or not
    // if (comment.user.toString() !== userId.toString()) {
    //   return handleServerError(
    //     res,
    //     "you are not allowed to update this comment."
    //   );
    // }

    // update comment

    const commentUpdates = await Comment.findByIdAndUpdate(commentId, {
      message,
    });

    // find post
    const post = await Post.findById(postId)
      .populate("user")
      .populate({
        path: "comment",
        populate: { path: "user" },
      });
    res.render("post-pages/postDetails", { post, error: "" });
  } catch (error) {
    handleServerError(res, "Failed to update Comment.");
  }
};

//delete own a comment
const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const postId = req.params.postId;
    console.log(commentId);
    console.log(postId);

    const userId = req.session.userAuth;
    // find post
    const postFound = await Post.findById(postId);

    postFound.comment.remove(commentId);
    await postFound.save();
    // find comment
    const comment = await Comment.findById(commentId);

    // check if comment exists
    if (!comment) {
      return handleServerError(res, "Comment not found.");
    }

    // check if the user making the request is the owner of the comment
    if (comment.user.toString() !== userId.toString()) {
      return handleServerError(
        res,
        "You are not allowed to delete this comment."
      );
    }

    // delete comment
    await Comment.findByIdAndDelete(commentId);

    const post = await Post.findById(postId)
      .populate("user")
      .populate({
        path: "comment",
        populate: { path: "user" },
      });

    console.log(post);

    res.render("post-pages/postDetails", { post });
    console.log("commment deleted");
  } catch (error) {
    handleServerError(res, "Failed to delete comment details.");
  }
};

export default {
  createComment,
  getAllComments,
  getComment,
  updateComment,
  deleteComment,
};
