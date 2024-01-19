import { handleServerError } from "../utils/commonFunction.js";

export const isProtected = (req, res, next) => {
  // check user is logged in or not
  if (req.session.userAuth) {
    next();
  } else {
    return res.render("unAuthorized");
  }
};
