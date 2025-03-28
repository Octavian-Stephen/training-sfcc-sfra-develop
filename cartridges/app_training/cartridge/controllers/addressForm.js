'use strict';

var $ = require('jquery'); // Ensure jQuery is available

$(document).ready(function () {
    // Update character count function
    function updateCharacterCount() {
        const textarea = $('#comments')[0]; // Get the textarea element
        const charCount = $('#char-count'); // Get the character count element
        const maxLength = textarea.getAttribute('maxlength');
        const currentLength = textarea.value.length;

        // Update the character count display
        charCount.text(currentLength + ' / ' + maxLength + ' characters used.');
    }

    // Attach the updateCharacterCount function to the textarea on input
    $('#comments').on('input', updateCharacterCount);

    // Initial update to show the character count when the page loads
    updateCharacterCount();
});
