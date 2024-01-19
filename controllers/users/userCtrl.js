import bcrypt from "bcryptjs";
import User from "../../models/users/User.js";
import {
  validateId,
  handleServerError,
  handleSuccess,
} from "../../utils/commonFunction.js";
import session from "express-session";

// User Register
const register = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    //return handleServerError(res, "please provide all the fields");

    return res.render("users/register", {
      error: "please provide all the fields",
    });
  }
  try {
    // check your exists
    const userFound = await User.findOne({ email });

    if (userFound) {
      console.log("user already ecist");
      return res.render("users/register", {
        error: "This  email already exists",
      });
    }
    //hash password

    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);
    console.log(passwordHashed);

    const user = await User.create({
      fullName: fullname,
      email,
      password: passwordHashed,
    });

    // save user to session
    req.session.userAuth = user._id;

    console.log(req.session);

    res.redirect("/api/v1/users/profile-page", { data: "Sidarth" }, { user });
  } catch (error) {
    handleServerError(res, "Failed to register");
  }
};

//  User login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    //  return handleServerError(res, "please provide valid credentials");
    return res.render("users/login", {
      error: "please provide all the fields",
    });
  }
  try {
    //check user exists
    const user = await User.findOne({ email });
    if (!user) {
      // return res.send({ error: "Not found" });
      return res.render("users/login", {
        error: "Invalid email",
      });
    }

    // verify password
    const isvalidPassword = await bcrypt.compare(password, user.password);
    if (!isvalidPassword) {
      //  return handleServerError(res, "please provide valid password");
      return res.render("users/login", {
        error: "Invalid password",
      });
    }

    // save user to session
    req.session.userAuth = user._id;

    console.log(req.session);

    res.redirect("/api/v1/users/profile-page", { data: "Sidarth" }, { user });
  } catch (error) {
    handleServerError(res, "Failed to login");
  }
};

// get all users
const getAllUsers = async (req, res) => {
  try {
    handleSuccess(res, "All users details.");
  } catch (error) {
    handleServerError(res, "Failed to get all users details.");
  }
};

// get User
const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    res.render("users/updateUser", { user, error: "" });
  } catch (error) {
    handleServerError(res, "Failed to get user details.");
  }
};

// update User
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { fullname, email, password } = req.body;
  console.log(fullname);
  console.log(password);
  console.log(email);
  try {
    const userFound = await User.findById(userId);

    if (!password) {
      return res.render("users/updateUser", {
        user: userFound,
        error: "please add new Password",
      });
    }

    // let's check same user or defferent user

    // let's hass new pass word

    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);

    const updatedUser = await User.findByIdAndUpdate(userId, {
      fullName: fullname,
      email,
      password: passwordHashed,
    });
    const user = await User.findById(userId);

    return res.redirect({ user }, "/api/v1/users/profile-page");
  } catch (error) {
    res.render("users/updateUser", { error: error });
  }
};

// delete User
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (validateId(id, res)) {
      handleSuccess(res, `user deleted with ID ${id}`);
    }
  } catch (error) {
    handleServerError(res, "Failed to delete user details.");
  }
};
//  get User profile
const getProfile = async (req, res) => {
  const userId = await req.session.userAuth;

  try {
    const user = await User.findById(userId)
      .populate("post")
      .populate("comment");

    res.render("users/profile", { user });
  } catch (error) {
    handleServerError(res, "Failed to get user profile");
  }
};

// upload User profile
const uploadProfile = async (req, res) => {
  console.log("got it");
  try {
    //check if file exist
    if (!req.file) {
      return res.render("users/uploadProfilePhoto", {
        error: "Please attach image!",
      });
    }
    //1. Find the user to be updated
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    //2. check if user is found
    if (!userFound) {
      return res.render("users/uploadProfilePhoto", {
        error: "User not found",
      });
    }
    //5.Update profile photo
    const userUpdated = await User.findByIdAndUpdate(
      userId,
      {
        profileImage: req.file.path,
      },
      {
        new: true,
      }
    );
    console.log(userUpdated);
    if (userUpdated) {
      //redirect
      return res.redirect("/api/v1/users/profile-page");
    }
  } catch (error) {
    return res.render("users/uploadProfilePhoto", {
      error: error.message,
    });
  }
};

// upload User cover photo
const uploadCoverPhoto = async (req, res) => {
  console.log("cover ");

  try {
    // Ensure that a file is present in the request

    console.log(req.file);
    if (!req.file) {
      console.log("cover photo");
      return res.render("users/uploadCoverPhoto", {
        error: "please attach Image!",
      });
    }

    // 1. find user id
    const userId = req.session.userAuth;
    // 2. check  user id
    const userFound = await User.findById(userId);
    // if (!userFound) {
    //   return handleClientError(res, "User not found.");
    // }
    console.log(userFound);
    // 3. upload image path to mongo db under profile image
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId }, // Assuming userId is the user's _id
      { coverImage: req.file.path },
      { new: true }
    );
    console.log(updatedUser);
    if (updatedUser) {
      return res.redirect("/api/v1/users/profile-page");
    }
  } catch (error) {
    handleServerError(res, "Failed to upload User cover photo");
  }
};

// update  User password
const updatePassword = async (req, res) => {
  const id = req.params.id;
  const password = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);

    if (password) {
      const updatedUser = await User.findOneAndUpdate(
        id,
        {
          password: passwordHashed,
        },
        { new: true }
      );

      if (updateUser) {
        handleSuccess(res, updatedUser);
      }
    }
  } catch (error) {
    handleServerError(res, "failed to update user password");
  }
};

// User logout

const logout = async (req, res) => {
  // destroy

  console.log("logged out");
  req.session.destroy(() => {
    res.redirect("/api/v1/users/login-page");
  });
};

export default {
  register,
  login,
  getProfile,
  uploadProfile,
  uploadCoverPhoto,
  updatePassword,
  logout,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
