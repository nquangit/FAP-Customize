// ==UserScript==
// @name         FAP auto login
// @namespace    http://tampermonkey.net/
// @version      2024-03-21
// @description  FAP auto login with Google account HCM 
// @author       You
// @match        https://fap.fpt.edu.vn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.vn
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Get the <select> element by its ID
    var selectElement = document.getElementById("ctl00_mainContent_ddlCampus");

    // Check if the selectElement is not null
    if (selectElement !== null) {
        // Get the value of the currently selected option
        var currentValue = selectElement.value;

        // Check if the currently selected value is not equal to "4"
        if (currentValue !== "4") {
            // Get the <option> element with the value "4"
            var optionToSelect = selectElement.querySelector("option[value='4']");

            // Check if the optionToSelect is not null
            if (optionToSelect !== null) {
                // Set the 'selected' attribute to 'true' for the desired option
                optionToSelect.selected = true;
            }
        }
    }

    function login_with_google() {
        window.__doPostBack('ctl00$mainContent$btnLogin','');
    }

    // Define a function to handle the keypress event
    function handleKeyPress(event) {
        // Check if the pressed key is the desired key (e.g., 'Enter' key)
        if (event.key === 'Enter') {
            // Your action to execute when the 'Enter' key is pressed
            login_with_google();
        }
    }

    // Add an event listener to the document to listen for keypress events
    document.addEventListener('keypress', handleKeyPress);
})();