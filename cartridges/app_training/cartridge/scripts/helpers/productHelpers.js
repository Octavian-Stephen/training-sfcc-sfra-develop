'use strict';

var base = module.superModule;

function calculatePercentageOff(standardPrice, salePrice) {
    var discountPercentage = 0; // Initialize with a default value

    // Ensure both prices are valid numbers (greater than 0) before calculating
    if (standardPrice > 0 && salePrice > 0 && salePrice < standardPrice) {
        discountPercentage =
            ((standardPrice - salePrice) / standardPrice) * 100;
        discountPercentage = Math.round(discountPercentage);
    }

    return discountPercentage;
}

base.calculatePercentageOff = calculatePercentageOff;
module.exports = base;
