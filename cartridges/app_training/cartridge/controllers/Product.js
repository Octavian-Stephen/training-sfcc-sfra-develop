'use strict';

// Import necessary modules

var server = require('server');
server.extend(module.superModule);

var ProductMgr = require('dw/catalog/ProductMgr');
var ProductSearchModel = require('dw/catalog/ProductSearchModel');
var CatalogMgr = require('dw/catalog/CatalogMgr');
var ProductSearch = require('*/cartridge/models/search/productSearch');

function getSuggestedProducts(product, req) {
    var suggestedProducts = [];
    if (product && product.isCategorized()) {
        var apiProductSearch = new ProductSearchModel();
        apiProductSearch.setCategoryID(product.getPrimaryCategory().ID);
        apiProductSearch.search();

        var productSearch = new ProductSearch(
            apiProductSearch,
            req.querystring,
            req.querystring.srule,
            CatalogMgr.getSortingOptions(),
            CatalogMgr.getSiteCatalog().getRoot()
        );

        for (var index = 0; index < 4; index++) {
            var suggestedProductId = productSearch.productIds[index].productID;
            var suggestedProduct = ProductMgr.getProduct(suggestedProductId);

            if (suggestedProduct) {
                suggestedProducts.push({
                    ID: suggestedProduct.ID,
                    image: suggestedProduct
                        .getImage('large', 0)
                        .getURL()
                        .toString(),
                    name: suggestedProduct.getName(),
                    price: {
                        currency: suggestedProduct.getPriceModel().getPrice()
                            .currencyCode,
                        sales: suggestedProduct.getPriceModel().getPrice().value
                    }
                });
            }
        }
    }
    return suggestedProducts;
}

// Define server route

server.append('Show', function (req, res, next) {
    var viewData = res.getViewData(); // Get existing view data
    var productId = viewData.product.id; // Get product ID from view data
    var product = ProductMgr.getProduct(productId);

    var suggestedProducts = getSuggestedProducts(product, req);

    res.setViewData({ suggestedProducts: suggestedProducts }); // Send data to front-end
    next(); // Continue to the next middleware
});

// Export the server module

module.exports = server.exports();
