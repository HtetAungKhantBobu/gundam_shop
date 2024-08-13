const express = require("express");
const { registerGet, loginGet, loginPost } = require("../controllers/authContorllers");
const authRouter = express.Router();

authRouter.get("/register", registerGet);

authRouter.get("/login", loginGet);

authRouter.post("/login", loginPost);

module.exports = authRouter;