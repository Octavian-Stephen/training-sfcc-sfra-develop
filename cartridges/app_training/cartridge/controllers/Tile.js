'use strict';
var server = require('server');
var productHelpers = require('*/cartridge/scripts/helpers/productHelpers');
server.extend(module.superModule);

server.append('Show', function (req, res, next) {
    var viewData = res.getViewData();
    var discountPercentage = null;

    // Check if the product and its price information are available
    if (viewData.product && viewData.product.price) {
        var product = viewData.product.price;
        var standardPrice = product.list.decimalPrice;
        var salePrice = product.sales.decimalPrice;

        // Check if standardPrice and salePrice are valid (greater than zero)
        if (standardPrice > 0 && salePrice > 0) {
            // Calculate the discount percentage using the helper function
            discountPercentage = productHelpers.calculatePercentageOff(
                standardPrice,
                salePrice
            );
        }
    }

    // Pass the discount percentage to the template
    viewData.discountPercentage = discountPercentage;
    res.setViewData(viewData);

    return next();
});

module.exports = server.exports();
