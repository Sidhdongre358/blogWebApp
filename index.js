import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import dbConnect from "./config/dbConnect.js";
import userRoute from "./routes/users/userRoute.js";
import postRoute from "./routes/posts/postRoute.js";
import commentRoute from "./routes/comments/commentRoute.js";
import errorHandler from "./middlewares/errorHandler.js";
import logger from "./middlewares/logger.js";
import MongoStore from "connect-mongo";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Post from "./models/posts/post.js";
import truncatePost from "./utils/helper.js";
import methodOverride from "method-override";
dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// helpers

app.locals.truncatePost = truncatePost;
// parse incoming data
app.use(express.json());
// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// configure view  engine ejs
app.set("view engine", "ejs");
console.log(__dirname);
// serve static files
app.use(express.static(__dirname + "/public"));
app.use(logger);
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 24 * 60 * 60, // 1 day time
    }),
  })
);
//method override
app.use(methodOverride("_method"));
// save the login user into local variable

app.use((req, res, next) => {
  if (req.session.userAuth) {
    res.locals.userAuth = req.session.userAuth;
  } else {
    res.locals.userAuth = null;
  }
  next();
});

//router home page
app.get("/", async (req, res) => {
  try {
    const allPosts = await Post.find();
    const posts = allPosts.reverse();
    res.render("home", { posts });
  } catch (error) {
    res.render("home", { error: error.message });
  }
});
app.use("/api/v1/users", userRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/comments", commentRoute);
app.use(errorHandler);
dbConnect();

// routes
// middlewares
// Error handling middlewars

// listener
app.listen(process.env.PORT, console.log(`Running at ${process.env.PORT}`));
