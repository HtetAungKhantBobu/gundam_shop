const Product = require("../models/ProductModel");
const { request, response } = require("express");


module.exports.productsGet = async function (req, res) {
    let products = await Product.find({ isDeleted: false });
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
    // return res.status(200).json({
    //     products
    // })

}


/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns {null}
 */
module.exports.productDetails = async function (req, res) {
    const id = req.params.id;
    try {
        const p = await Product.findById(id);
        if (!p) {
            res.status(404).json({
                error: [
                    { product: "Not Found" }
                ]
            })
            return;
        }
        res.render('product-details', { product: p, page_title: p.name })
    } catch (err) {
        res.status(400).json({
            error: [
                {
                    product: err.message
                }
            ]
        })
    }
    // 

}

module.exports.updateProduct = async function (req, res) {
    let { id } = req.params;
    // let product = await Product.findById(id);

    let update_data = req.body
    let valid_fields = Object.keys(Product.schema.paths).filter(field => field != "_id" && field != "__v");

    update_data = Object.fromEntries(
        Object.entries(update_data).filter(f => valid_fields.includes(f[0]))
    )
    console.log(update_data)
    let product = await Product.findByIdAndUpdate(id, update_data, { new: true, runValidators: true });
    if (!product) {
        res.status(404).json({
            errors: [
                { product: "Not Found" }
            ]
        })
        return;
    }

    res.status(200).json({ product });
}

module.exports.updateProductGet = async function (req, res) {
    let { id } = req.params
    let product = await Product.findById(id);
    if (!product) {
        res.status(404).json({
            error: "Not Found"
        })
        return;
    }
    res.render("product-update", { page_title: "Update Product", product })
}

module.exports.deleteProduct = async function (req, res) {
    let { id } = req.params;
    Product.findByIdAndDelete(id)
        .then(() => {
            res.status(200).json({
                data: "Deleted Successfully"
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                errors: [
                    {
                        product: "Something went wrong."
                    }
                ]
            })
        })
}

module.exports.softDeleteProduct = async function (req, res) {
    let { id } = req.params;
    try {
        await Product.findByIdAndUpdate(id, { isDeleted: true })
        res.status(200).json({
            data: "Deleted Successfully"
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            errors: [
                {
                    product: "Cannot delete"
                }
            ]
        })
    }
}