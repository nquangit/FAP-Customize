// ==UserScript==
// @name         LMS FPT
// @namespace    http://tampermonkey.net/
// @version      2024-03-24
// @description  LMS FPT!
// @author       You
// @match        https://lms-hcmuni.fpt.edu.vn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.vn
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function login_with_google() {
        var loginBtn = document.querySelector('a.btn.btn-secondary.btn-block');
        loginBtn.click();
    }

    function localStorageSet(key, value) {
        localStorage.setItem(key, value);
    }

    function localStorageGet(key) {
        return localStorage.getItem(key);
    }

    // Add an event listener to the document to listen for keypress events
    document.addEventListener('keypress', handleKeyPress);

    const WIDTH = "300px";
    const HEIGHT = "200px";
    const AUTO_LOGIN = "autologin";
    const LEARN_SUB = "currentlearningsubject"
    const LEARN_SUB_EN = "currentlearningsubjectenable"

    // Add auto login check box
    function addAutoLogin(parentDiv) {
        // init localStorage
        if (localStorageGet(AUTO_LOGIN) === null) {
            localStorageSet(AUTO_LOGIN, "false");
        }

        var autoLoginContainer = document.createElement('div');
        var autoLoginCheckbox = document.createElement("input");
        autoLoginCheckbox.type = "checkbox";
        autoLoginCheckbox.id = "autoLoginCheckbox";

        var autoLoginLabel = document.createElement("label");
        autoLoginLabel.setAttribute("for", "autoLoginCheckbox");
        autoLoginLabel.textContent = "Auto Login";

        var autoLoginValue = localStorageGet(AUTO_LOGIN) === "true";
        autoLoginCheckbox.checked = autoLoginValue;

        autoLoginContainer.appendChild(autoLoginCheckbox);
        autoLoginContainer.appendChild(autoLoginLabel);
        parentDiv.appendChild(autoLoginContainer);

        // Listen for changes to the checkbox
        autoLoginCheckbox.addEventListener("change", function() {
            // Update the value in localStorage
            localStorageSet(AUTO_LOGIN, autoLoginCheckbox.checked);
        });
    }

    function contextMenu() {
        var customMenu = document.getElementById("customMenu");
        document.addEventListener("contextmenu", function(event) {
            // Prevent the default right-click context menu
            event.preventDefault();

            // Show the custom menu div at the position of the right-click
            // var customMenu = document.getElementById("customMenu");
            customMenu.style.display = "block";
            customMenu.style.top = event.clientY + "px";
            customMenu.style.left = event.clientX + "px";
        });
        // Hide the custom context menu when clicking outside of it
        document.addEventListener("click", function(event) {
            if (event.target !== customMenu) {
                customMenu.style.display = "none";
            }
        });
    }

    function addLearningCourse(parentDiv) {
        // init localStorage
        var learningSubject = JSON.parse(localStorageGet(LEARN_SUB));
        if (learningSubject === null || !(Array.isArray(learningSubject))) {
            learningSubject = [];
            localStorageSet(LEARN_SUB, JSON.stringify(learningSubject));
        }
        var liElements = getCourse();
        var customMenu = document.createElement("ul");
        customMenu.className = "customMenu";
        customMenu.id = "customMenu";

        liElements.forEach(function(li) {
            if (learningSubject.length === 0) {
                customMenu.appendChild(li.cloneNode(true));
            } else {
                learningSubject.forEach(function(sub) {
                    if (li.textContent.toLowerCase().includes(sub.toLowerCase())) {
                        customMenu.appendChild(li.cloneNode(true));
                    }
                });
            }
        });
        document.body.appendChild(customMenu);

        var customMenuStyle = document.createElement('style');
        customMenuStyle.innerHTML = `
            #customMenu.customMenu {
                list-style: none;
                position: fixed;
                border: 1px solid #ccc;
                border-radius: 10px;
                padding: 10px 5px;
                z-index: 9999;
                background-color: #2B2D42;
                color: #FFFFFF!important;
                display: none;
            }
            #customMenu.customMenu li {
                line-height: 28px;
            }
            #customMenu.customMenu a.dropdown-item {
                color: #fff;
            }
            #customMenu.customMenu a.dropdown-item:hover {
                color: #2B2D42;
                border-radius: 10px;
            }
        `;
        document.head.appendChild(customMenuStyle);

        if (localStorageGet(LEARN_SUB_EN) === null) {
            localStorageSet(LEARN_SUB_EN, "false");
        }
        var listLearningCourseContainer = document.createElement("div");
        var listLearningCourse = document.createElement("input");
        var listLearningCourseCheck = document.createElement("input");
        listLearningCourseCheck.type = "checkbox";
        listLearningCourseCheck.id = "listLearningCourseCheckBox";
        var listLearningCourseCheckValue = localStorageGet(LEARN_SUB_EN) === "true";
        listLearningCourseCheck.checked = listLearningCourseCheckValue;

        listLearningCourse.id = "listLearningCourse";
        listLearningCourse.placeholder = "CRS1|CRS2";
        listLearningCourse.value = learningSubject.join("|");

        listLearningCourseContainer.appendChild(listLearningCourseCheck);
        listLearningCourseContainer.appendChild(listLearningCourse);
        parentDiv.appendChild(listLearningCourseContainer);

        listLearningCourse.addEventListener("change", function(event) {
            localStorageSet(LEARN_SUB, JSON.stringify(event.target.value.split("|")));
        });
        listLearningCourseCheck.addEventListener("change", function() {
            // Update the value in localStorage
            localStorageSet(LEARN_SUB_EN, listLearningCourseCheck.checked);
        });
        if (listLearningCourseCheck.checked) {
            contextMenu();
        }
    }

    function getCourse() {
        var parentElement = document.querySelector("#dropdownmain-navigation00.dropdown-menu");
        var liElements = parentElement.querySelectorAll("li");
        return liElements;
    }


    // Inside
    function loadMySetting() {
        var settingPanel = document.createElement('div');
        settingPanel.className = "my-setting-panel";
        settingPanel.id = "my-setting-panel";
        settingPanel.style.height = "0px";

        var settingPanelContainer = document.createElement('div');
        settingPanelContainer.className = "my-setting-panel-container";
        settingPanelContainer.id = "my-setting-panel-container";
        settingPanelContainer.style.display = "none";

        var collapseBtn = document.createElement('div');
        collapseBtn.className = "my-setting-panel-collapse";
        collapseBtn.innerHTML = `<i class="fa-solid fa-plus"></i>`;
        collapseBtn.addEventListener("click", function() {
            if (settingPanel.style.height === "0px") {
                settingPanel.style.display = "block";
                settingPanel.style.height = HEIGHT;
                settingPanel.style.width = WIDTH;
                settingPanel.style.opacity = 0.8;
                settingPanel.style.color = "#fff"
                collapseBtn.innerHTML = '<i class="fas fa-times"></i>';
                settingPanel.style.backgroundColor = "#2B2D42";
                settingPanelContainer.style.display = "block";
            } else {
                settingPanel.style.height = "0px";
                settingPanel.style.width = "0px";
                settingPanel.style.opacity = 1;
                settingPanel.style.color = "#000"
                collapseBtn.innerHTML = '<i class="fas fa-plus"></i>';
                settingPanel.style.backgroundColor = "transparent";
                settingPanelContainer.style.display = "none";
            }
        });


        settingPanel.appendChild(collapseBtn);
        addAutoLogin(settingPanelContainer);
        addLearningCourse(settingPanelContainer)
        settingPanel.appendChild(settingPanelContainer);
        document.body.appendChild(settingPanel);

        var settingPanelStyle = document.createElement('style');
        settingPanelStyle.innerHTML = `
            div.my-setting-panel {
                display: flex;
                position: fixed;
                z-index: 999999;
                top: 10px;
                right: 15px;
                opacity: 1;
                color: #ffffff;
                padding: 15px;
            }
            div.my-setting-panel-collapse {
                position: absolute;
                top: 2px;
                right: 5px;
                color: #ffffff;
                cursor: pointer;
            }
            #autoLoginCheckbox {
                margin-right: 7px;
            }
        `;
        document.head.appendChild(settingPanelStyle);

        // Create a script element
        var fontAwesomeScript = document.createElement("script");

        // Set attributes for the script element
        fontAwesomeScript.src = "https://kit.fontawesome.com/83deac4c03.js";
        fontAwesomeScript.setAttribute("crossorigin", "anonymous");

        // Append the script element to the document's head
        document.head.appendChild(fontAwesomeScript);

        // Create a link element
        var fontAwesomeLink = document.createElement("link");

        // Set attributes for the link element
        fontAwesomeLink.rel = "stylesheet";
        fontAwesomeLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
        fontAwesomeLink.integrity = "sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==";
        fontAwesomeLink.crossOrigin = "anonymous";
        fontAwesomeLink.referrerPolicy = "no-referrer";

        // Append the link element to the document's head
        document.head.appendChild(fontAwesomeLink);

        // Get the movable element
        var movableElement = document.getElementById("my-setting-panel-disabled"); // set the value to my-setting-panel to enable move

        // Variables to store mouse coordinates
        var offsetX, offsetY;

        // Event listener for mouse down event
        movableElement.addEventListener("mousedown", function(event) {
            // Get the current mouse position
            offsetX = event.clientX - movableElement.offsetLeft;
            offsetY = event.clientY - movableElement.offsetTop;
            // Enable moving by adding event listeners for mousemove and mouseup events
            document.addEventListener("mousemove", moveElement);
            document.addEventListener("mouseup", stopMoving);
        });

        // Function to move the element
        function moveElement(event) {
            // Calculate new position based on mouse movement
            var newX = event.clientX - offsetX;
            var newY = event.clientY - offsetY;
            // Set the new position of the movable element
            movableElement.style.left = newX + "px";
            movableElement.style.top = newY + "px";
        }

        // Function to stop moving the element
        function stopMoving() {
            // Remove event listeners for mousemove and mouseup events
            document.removeEventListener("mousemove", moveElement);
            document.removeEventListener("mouseup", stopMoving);
        }


    }

    function auto_login() {
        var username = document.getElementById("usermenu");
        if (username === null) {
            if (localStorageGet(AUTO_LOGIN) === "true") {
                login_with_google();
            }
        } else {
            loadMySetting();
        }
    }

    auto_login();

    // Define a function to handle the keypress event
    function handleKeyPress(event) {
        // Check if the pressed key is the desired key (e.g., 'Enter' key)
        if (event.key === 'Enter') {
            // Your action to execute when the 'Enter' key is pressed
            login_with_google();
        }
    }
})();