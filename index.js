const express = require('express');
require('dotenv').config();
const cors = require('cors')

const Shopify = require("shopify-api-node")

const port = 3000

const shopify = new Shopify({
    shopName: "quickstart-230ce2ff.myshopify.com",
    apiKey: "732243db4195b90b6b3a8e74e1f47417",
    password: "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"
});

const app = express()
app.use(cors({
    origin: '*'
}))

app.get("/", async (req, res) => {

    const { sort } = req.query

    const product = await shopify.product.list({ limit: 5 })


    if (sort == "asc") {
        const asc_product = product.sort((asc, desc) => asc.title.localeCompare(desc.title))
        return res.json(asc_product)
    } else if (sort == "desc") {
        console.log('wrold')
        const desc_product = product.sort((asc, desc) => desc.title.localeCompare(asc.title));
        return res.json(desc_product)
    } else {
        res.json(product)
    }


})


app.listen(port, () => console.log(`Listening at http://localhost:${port}`));