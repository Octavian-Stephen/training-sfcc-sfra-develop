'use strict';

/**
 * @namespace Cart
 */

var server = require('server');
server.extend(module.superModule);
var BasketMgr = require('dw/order/BasketMgr');
var Site = require('dw/system/Site');
var ContentMgr = require('dw/content/ContentMgr');

function show(req, res, next) {
    // Get the current basket (cart)
    var cart = BasketMgr.getCurrentBasket();

    // Retrieve the cart total threshold from site preferences (default to 200)
    var cartTotalThreshold =
        Site.getCurrent().getCustomPreferenceValue('cartTotalThreshold') || 200;

    var cartTotal = 0;
    var message = null; // Initialize message as null

    // Check if cart exists and fetch the total gross price if available
    if (cart && cart.totalGrossPrice) {
        cartTotal = cart.totalGrossPrice.value;
    }

    // Check if the cart is empty
    var isCartEmpty = !cart || cart.productLineItems.length === 0;

    // Check if the cart total exceeds the threshold
    if (!isCartEmpty && cartTotal >= cartTotalThreshold) {
        // Retrieve the content asset with the custom message
        var contentAsset = ContentMgr.getContent('cart-total-message');

        // Assign the message based on content asset or default message
        message =
            contentAsset && contentAsset.custom && contentAsset.custom.body
                ? contentAsset.custom.body.markup
                : 'Your cart total exceeds $' + cartTotalThreshold + '!';
    }

    // Render the cart page with the message and threshold
    res.render('cart/cart', {
        cartMessage: message,
        cartTotalThreshold: isCartEmpty ? null : cartTotalThreshold // Pass the threshold only if cart is not empty
    });

    return next();
}

// Append the 'show' function to the 'Show' controller action
server.append('Show', function (req, res, next) {
    show(req, res, next);
});

module.exports = server.exports();
