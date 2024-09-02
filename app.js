const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const { db_connect } = require("./database/dbHelper");
const { get_top3 } = require("./helpers/helpers")
const { injectUser } = require("./middlewares/middleware");
const { everyMinute } = require("./services/cronServices")
const userRouter = require("./routers/userRouters");
const authRouter = require("./routers/authRouters");
const productRouter = require("./routers/productRouter");


const app = express();


app.set("port", 3000);
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/static", express.static(`${__dirname}/publics`));
app.use("*", injectUser);

app.get("/", async (req, res) => {
    selection = await get_top3();
    res.render("home", {
        welcomeString: "Hi Nice to see you",
        page_title: "Home",
        selection: selection
    });
});
//nginx
app.use("/", userRouter);
app.use("/", authRouter);
app.use("/", productRouter);
app.get("/run-job", (req, res) => {
    everyMinute.fireOnTick();
    res.status(200).json({
        data: "running"
    })
})

db_connect().then(
    () => {
        app.listen(app.get("port"), () => {
            console.log(`Server is up and running at localhost:${app.get("port")}`);
        });
    }
).catch(
    err => {
        console.log("Can't connect to db. Can't start the server.");
    }
);