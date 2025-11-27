const express = require('express');
const fs = require('fs');
const xpath = require('xpath');
const { DOMParser } = require('xmldom');

const app = express();
app.use(express.json());
app.use(express.static('../frontend'));

app.get("/search", (req, res) => {
    const { category, min, max, stock } = req.query;

    const xml = fs.readFileSync("../data/products.xml", "utf8");
    const doc = new DOMParser().parseFromString(xml);

    let query = "//product";

    if (category) query += `[category='${category}']`;
    if (stock) query += `[stock='${stock}']`;
    if (min && max) query += `[price >= ${min} and price <= ${max}]`;

    const nodes = xpath.select(query, doc);

    res.json(nodes.map(n => ({
        id: n.getAttribute("id"),
        name: xpath.select1("string(name)", n),
        category: xpath.select1("string(category)", n),
        price: xpath.select1("string(price)", n),
        stock: xpath.select1("string(stock)", n),
    })));
});

app.listen(3000, () => console.log("Server running on port 3000"));
