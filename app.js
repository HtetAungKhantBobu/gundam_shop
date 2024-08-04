const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config();
const { db_connect } = require("./database/dbHelper");
const { User } = require("./models/UserModel");
const ejs = require("ejs");

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


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/static", express.static(`${__dirname}/publics`));
app.set("view engine", "ejs");



const createToken = function (id) {
    let payload = { id };
    let token = jwt.sign(payload, process.env.JWT_SECRET);
    return token;
}

const handleErr = function (err) {
    errors = {}
    if (err.code == 11000) {
        let path = Object.keys(Object.values(err)[0].keyPattern)[0]
        errors[path] = `${path} is already taken`;
        return errors;
    }
    if (err.message.includes("validation fail")) {
        Object.values(err.errors).forEach(({ properties }) => {
            //Object.values(err.errors).forEach(({properties})=>e.properties)
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

const authenticated = function (req, res, next) {
    let token = req.cookies._token;
    if (!token) {
        res.redirect("/login");
        return;
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, token) => {
        if (err) {
            res.redirect("/login");
            return;
        }
        next();

    })
}


app.get("/", (req, res) => {
    res.render("home", {
        welcomeString: "Hi Nice to see you",
        page_title: "Home",
        selection: selection
    });
});

app.get("/register", (req, res) => {
    res.render("register", {
        page_title: "Register"
    });
})

app.get("/login", (req, res) => {
    res.render("login", { page_title: "Sign In" })
})

app.post("/login", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let user = await User.findOne({ email: email });
    if (!user) {
        res.status(404).json({
            "errors": {
                "email": "email not found"
            }
        });
        return;
    }
    let check_password = await bcrypt.compare(password, user.password);
    if (!check_password) {
        res.status(400).json({
            errors: {
                "password": "wrong password"
            }
        });
        return;
    }
    let token = createToken(user.id);
    res.cookie("_token", token, { maxAge: 1000 * 60 * 60 * 24 });
    res.status(200).json({
        "data": "ok"
    });
})

app.post("/users", async (req, res) => {
    console.log(req.body)
    let newUser = User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    newUser.save()
        .then(
            () => {
                let token = createToken(newUser.id);
                res.cookie("_token", token, { maxAge: 1000 * 60 * 60 * 24 });
                res.status(201).json({
                    id: newUser.id
                });
            }
        )
        .catch(

            err => {
                let errors = handleErr(err)
                res.status(400).json({
                    errors
                });
            }
        );
});

app.get("/users", async (req, res) => {
    try {
        let users = await User.find();
        res.status(200).json({ data: users });
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong. Praying..."
        });
    }
});

app.get("/users/:id", async (req, res) => {

    User.findById(req.params.id)
        .then(document => {
            res.status(200).json(document);
        })
        .catch(err => {
            res.status(404).json(
                {
                    message: "Not Found"
                }
            );
        });
});


app.get("/set-cookies", (req, res) => {
    // res.setHeader("Set-Cookie", "name=test-cookie");
    res.cookie("test-cookie", "test cookie value", { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
    res.cookie("test-cookie-https", "test cookie value", { maxAge: 1000 * 60 * 60 * 24, httpOnly: false });

    res.cookie("test-cookie-https-2", "test cookie value", { maxAge: 1000 * 60 * 60 * 24, httpOnly: false });
    res.send("You've got the cookies");
})

app.get("/get-cookies", (req, res) => {
    let cookies = req.cookies;
    console.log(cookies);
    res.json({ cookies })
})

app.get("/get-token", (req, res) => {
    let payload = {
        id: 123
    };
    let token = jwt.sign(payload, process.env.JWT_SECRET);
    res.send({ token });
})

app.post("/test-token", (req, res) => {
    let test_token = req.body.token;

    /*
    try{
    let payload = jwt.verify(...)
}catch{
    return error
}
    */
    jwt.verify(test_token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            res.send({ message: "you suck" });
            return;
        }
        res.send({ payload });
    })

})

app.get("/products", authenticated, (req, res) => {
    res.render("products", { page_title: "Products" });
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