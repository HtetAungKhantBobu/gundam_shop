const express = require("express");

const { usersGet, usersPost, getUserById } = require("../controllers/userControllers");
const userRouter = express.Router();


userRouter.post("/users", usersPost);

userRouter.get("/users", usersGet);

userRouter.get("/users/:id", getUserById);

module.exports = userRouter;