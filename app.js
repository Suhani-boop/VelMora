const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const connectDB = require("./init/db");
const Product = require("./models/Product");
const seedProducts = require("./data");

const app = express();
const port = 3000;


// DB CONNECT
connectDB();


// SEED DATA
mongoose.connection.once("open", async () => {
    const count = await Product.countDocuments();

    if (count === 0) {
        await Product.insertMany(seedProducts);
        console.log("🌱 15 Products Inserted");
    }
});


// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));


// VIEW ENGINE
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// STATIC
app.use(express.static(path.join(__dirname, "public")));


// HOME
app.get("/", (req, res) => {
    res.redirect("/products");
});


// INDEX
app.get("/products", async (req, res) => {
    const products = await Product.find();
    res.render("products/index", { products });
});


// NEW
app.get("/products/new", (req, res) => {
    res.render("products/new");
});


// CREATE
app.post("/products", async (req, res) => {
    await Product.create(req.body);
    res.redirect("/products");
});


// SHOW
app.get("/products/:id", async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render("products/show", { product });
});


// EDIT
app.get("/products/:id/edit", async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render("products/edit", { product });
});


// UPDATE
app.put("/products/:id", async (req, res) => {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/products");
});


// DELETE
app.delete("/products/:id", async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/products");
});


// SERVER
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});