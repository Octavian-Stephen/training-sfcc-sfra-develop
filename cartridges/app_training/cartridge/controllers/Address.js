'use strict';

var server = require('server');
server.extend(module.superModule);
var URLUtils = require('dw/web/URLUtils');
var Transaction = require('dw/system/Transaction');
var Resource = require('dw/web/Resource'); // Load the Resource module

/**
 * Custom Show route for displaying the address form
 */
server.get('Show', function (req, res, next) {
    var form = server.forms.getForm('addressForm');
    res.render('addressForm', {
        form: form
    });
    next();
});

/**
 * Custom Submit route for handling form submission
 */
server.post('Submit', function (req, res, next) {
    var form = server.forms.getForm('addressForm');
    var isValid = true;
    var errors = {};

    // Validate postalCode using regex
    var postalCode = form.postalCode.value;
    if (!/^[0-9]{5}(-[0-9]{4})?$/.test(postalCode)) {
        isValid = false;
        errors.postalCode = Resource.msg(
            'addressForm.postalCode.error',
            'forms',
            null
        );
    }

    // Validate cardNumber (must be 16 digits)
    var cardNumber = form.cardNumber.value;
    if (!/^\d{16}$/.test(cardNumber)) {
        isValid = false;
        errors.cardNumber = Resource.msg(
            'addressForm.cardNumber.error',
            'forms',
            null
        );
    }

    if (isValid) {
        Transaction.wrap(function () {
            var addressData = {
                firstname: form.firstname.value,
                lastname: form.lastname.value,
                street: form.street.value,
                city: form.city.value,
                state: form.state.value,
                postalCode: form.postalCode.value,
                country: form.country.value,
                cardNumber: form.cardNumber.value,
                expiryDate: form.expiryDate.value,
                cvv: form.cvv.value,
                comments: form.comments.value
            };
            // Process and save addressData as needed
        });
        res.redirect(URLUtils.url('Address-Show'));
    } else {
        res.render('addressForm', {
            form: form,
            errors: errors
        });
    }
    next();
});

module.exports = server.exports();
