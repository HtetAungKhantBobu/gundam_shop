const express = require("express");
const bodyParser = require("body-parser");
const { db_connect } = require("./database/dbHelper");
const { User } = require("./models/UserModel");
const ejs = require("ejs");

const app = express();
app.set("port", 3000);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/static", express.static(`${__dirname}/publics`));
app.set("view engine", "ejs");


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



app.get("/", (req, res) => {
    res.render("home", {
        welcomeString: "Hi Nice to see you",
        page_title: "Home"
    });
});

app.get("/register", (req, res) => {
    res.render("register", {
        page_title: "Register"
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

app.get("/set-cookie", (req, res) => {
    res.setHeader("Set-Cookie", "test-cookie=test-data");
    res.send("You've got cookied!");
})

app.get("/get-cookie", (req, res) => {
    console.log(req);
});

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