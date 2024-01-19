import express from "express";

import userCtrl from "../../controllers/users/userCtrl.js";
import { isProtected } from "../../middlewares/isProtected.js";
import storage from "../../config/cloudinary.js";
import multer from "multer";

//instance of multer

const uploadPhoto = multer({ storage });

const userRoute = express.Router();

/*
      These routes for Getting the pages for client side 
*/
//     Home page  not required
userRoute.get("/home-page", async (req, res) => {
  res.send("works! from user");
});

// login-page
userRoute.get("/login-page", async (req, res) => {
  res.render("users/login", { error: "" });
});

// register-page

userRoute.get("/register-page", async (req, res) => {
  res.render("users/register", { error: "" });
});

// user progile-page

// userRoute.get("/profile-page", isProtected, async (req, res) => {
//   res.render("users/profile");
// });

// upload-profile-photo-page
userRoute.get("/upload-profile-photo-page", isProtected, async (req, res) => {
  res.render("users/uploadProfilePhoto", { error: "" });
});
// upload-cove-photo-page
userRoute.get("/upload-cover-photo-page", isProtected, async (req, res) => {
  res.render("users/uploadCoverPhoto", { error: "" });
});
// update-details-page
// userRoute.get("/update-user-page", isProtected, async (req, res) => {
//   res.render("users/updateUser", { error: "" });
// });
/*
        Below routes are for Backend API's 
*/

// Register User
userRoute.post("/register", userCtrl.register);

// user login
userRoute.post("/login", userCtrl.login);

// Get all users
userRoute.get("/", userCtrl.getAllUsers);

// get profile
// get profile after login
userRoute.get("/profile-page", isProtected, userCtrl.getProfile);
// upload profile
userRoute.post(
  "/profile-photo-upload",
  isProtected,
  uploadPhoto.single("profile"),
  userCtrl.uploadProfile
);
// upload cover photo
userRoute.post(
  "/cover-Photo-Upload",
  isProtected,
  uploadPhoto.single("coverImage"),
  userCtrl.uploadCoverPhoto
);
// get a single user

//log out user
userRoute.get("/logout", userCtrl.logout);

userRoute.get("/:id", userCtrl.getUser);
// update a user
userRoute.post("/:id", userCtrl.updateUser);
// delete a user
userRoute.delete("/:id", userCtrl.deleteUser);

// update password
userRoute.put("/update-password/:id", userCtrl.updatePassword);

export default userRoute;
