const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const { db_connect } = require("./database/dbHelper");
const { injectUser } = require("./middlewares/middleware");
const userRouter = require("./routers/userRouters");
const authRouter = require("./routers/authRouters");
const productRouter = require("./routers/productRouter");


const app = express();

const selection = [
    {
        img: "https://inwfile.com/s-da/8xd44e.jpg",
        title: "Gundam rx 78 2",
        description: "The classic that started it all."
    },
    {
        img: "https://da.lnwfile.com/_/da/_raw/96/6g/4w.jpg",
        title: "Zaku II",
        description: "Iconic adversary with detailed parts."
    },
    {
        img: "https://inwfile.com/s-da/re5d6o.jpg",
        title: "Wing Gundam Zero Ew",
        description: "Fan favorite with stunning wings."
    }
]

app.set("port", 3000);
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/static", express.static(`${__dirname}/publics`));
app.use("*", injectUser);

app.get("/", (req, res) => {
    res.render("home", {
        welcomeString: "Hi Nice to see you",
        page_title: "Home",
        selection: selection
    });
});

app.use("/", userRouter);
app.use("/", authRouter);
app.use("/", productRouter);

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