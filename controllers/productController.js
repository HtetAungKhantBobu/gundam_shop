const Product = require("../models/ProductModel");

const sample_products = [
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
    },
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


module.exports.productsGet = async function (req, res) {
    let products = await Product.find();
    res.render("products", { page_title: "Products", products: products });
}

module.exports.productPost = async function (req, res) {
    let name = req.body.name;
    let price = req.body.price;
    let img = req.body.img;
    let description = req.body.description;
    product = new Product({
        name, price, img, description
    })
    try {
        product = await product.save();
        res.status(201).json({
            product
        })
    } catch (err) {
        res.json({
            errors: err.message
        })
    }
}

module.exports.addProduct = function (req, res) {
    res.render("add-product", { page_title: "Add Product" })
}

module.exports.searchProduct = async function (req, res) {
    let keyword = req.query.keyword;
    if (keyword === "") {
        res.redirect("/products")
        return;
    }
    let products = await Product.find({ "name": { "$regex": keyword, "$options": "i" } });
    res.render("partials/selection-section", { selection: products }, (err, html) => {
        if (err) {
            res.status(500).json(
                {
                    "error": "something went wrong"
                }
            )
            return;
        }

        res.status(200).json(
            {
                html
            }
        )
    })

}