const express = require('express');
require('dotenv').config();
const cors = require('cors')

const Shopify = require("shopify-api-node")

const port = 3001

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

    try {
        const { sort, page = 1, perPage = 50, search } = req.query;

        // Fetch all products (consider using cursor-based pagination for large datasets)

        let allProducts = []
        const result = await shopify.product.list({ limit: 250 })

        let params = result.nextPageParameters

        allProducts = [...result]
        while (params !== undefined) {
            const products = await shopify.product.list(params)

            allProducts = allProducts.concat(products)

            params = products.nextPageParameters
        }

        // Apply search filter
        let filteredProducts = allProducts;
        if (search) {
            filteredProducts = allProducts.filter((product) =>
                product.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Apply sorting
        if (sort === 'asc') {
            filteredProducts.sort((asc, desc) => asc.title.localeCompare(desc.title));
        } else if (sort === 'desc') {
            filteredProducts.sort((asc, desc) => desc.title.localeCompare(asc.title));
        }

        // Paginate the results
        const startIndex = Number(page) * Number(perPage);
        const endIndex = startIndex + perPage;
        const paginatedProducts = filteredProducts.slice(0, startIndex);

        return res.json(paginatedProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

})


app.listen(port, () => console.log(`Listening at http://localhost:${port}`));