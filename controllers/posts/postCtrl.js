import Post from "../../models/posts/Post.js";
import User from "../../models/users/User.js";
import {
  validateId,
  handleServerError,
  handleSuccess,
} from "../../utils/commonFunction.js";

// Create post
const createPost = async (req, res) => {
  console.log("add post ctrl");

  console.log(req.body);

  const { title, description, category } = req.body;

  try {
    if (!title || !description || !category) {
      console.log(" empty field");
      return res.render("post-pages/addPost", {
        error: "please add all fields",
      });
    }

    const userId = req.session.userAuth;

    // 1. findout user
    const userFound = await User.findById(userId);
    if (!userFound) {
      console.log("user empty ");

      return res.render("post-pages/addPost", { error: "please login" });
    }

    // 2. save post to mongodb

    const postAdded = await Post.create({
      title,
      description,
      category,
      image: req.file.path,
      user: userFound._id,
    });
    console.log(postAdded);

    // 3. add uploaded post into the post array of User
    userFound.post.unshift(postAdded._id);

    // 4. Save user
    await userFound.save();

    res.render("post-pages/addPost", { error: "", success: "Post Uploaded" });

    console.log("post uploaded ");
  } catch (error) {
    handleServerError(res, "Failed to create post.");
  }
};

// get all post
const getAll = async (req, res) => {
  try {
    const posts = await Post.find().populate("comment");

    res.render("post-pages/allPosts", { posts });
  } catch (error) {
    handleServerError(res, "Failed to get all posts details.");
  }
};

// get single post
const fetchSinglePost = async (req, res) => {
  const postId = req.params.id;
  try {
    if (validateId(postId, res)) {
      const post = await Post.findById(postId)
        .populate("user")
        .populate({
          path: "comment",
          populate: { path: "user" },
        });

      res.render("post-pages/postDetails", { post });
    }
  } catch (error) {
    handleServerError(res, "Failed to get post details.");
  }
};

// update a post
const updatePost = async (req, res) => {
  console.log("update post ctrl");

  // Move the declaration of postId before using it
  const postId = req.params.id;

  const { title, description, category } = req.body;

  try {
    const postFound = await Post.findById(postId);

    if (!title || !description || !category) {
      return res.render("post-pages/updatePost", {
        post: postFound,
        error: "All fields are required",
      });
    }

    const userId = req.session.userAuth;

    // check user and post exist in the DB
    console.log(postId);
    const userFound = await User.findById(userId);

    if (postFound.user.toString() !== userId.toString()) {
      return handleServerError(res, "You're not allowed to update this post.");
    }

    // Perform the update logic here

    const updatePost = await Post.findByIdAndUpdate(postId, {
      title,
      category,
      description,
      image: req.file.path,
    });
    console.log(updatePost);

    
    return res.redirect("/");

    // Check that the post belongs to the user or not
  } catch (error) {
    console.log("Failed to update post ", error);
    return res.redirect("/");
  }
};

// delete own post
const deletePost = async (req, res) => {
  try {
    // user can delete own post

    // 1. get userID and PostID

    const userId = req.session.userAuth;
    const postId = req.params.id;
    // check user and post exists in the DB

    const userFound = await User.findById(userId);
    const postFound = await Post.findById(postId);
    //handleSuccess(res, `post deleted with ID ${postFound}`);

    // check that post belongs to the user or not

    if (postFound.user.toString() !== userId.toString()) {
      res.render("post-pages/postDetails", {
        error: "You are not allowed to delete",
      });
    }
    //  delete post from post collection and user's Post array
    if (userFound && postFound) {
      await Post.findOneAndDelete({ _id: postId });
      userFound.post.remove(postId);
      // save user
      await userFound.save();

      res.redirect("/");
    }
  } catch (error) {
    res.render("post-pages/postDetails", {
      error: "You are not allowed to delete",
    });
  }
};

export default { createPost, getAll, fetchSinglePost, updatePost, deletePost };
