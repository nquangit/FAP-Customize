// ==UserScript==
// @name         FAP Auto Feedback
// @namespace    http://tampermonkey.net/
// @version      2024-02-20
// @description  try to take over the world!
// @author       You
// @match        https://fap.fpt.edu.vn/Feedback/DoFeedback.aspx?Id=*
// @match        https://fap.fpt.edu.vn/Feedback/EditDoFeedback.aspx?fb=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.vn
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function action() {
        document.getElementById("ctl00_mainContent_reload_ctl00_chkList_0").click();
        document.getElementById("ctl00_mainContent_reload_ctl02_chkList_0").click();
        document.getElementById("ctl00_mainContent_reload_ctl01_chkList_0").click();
        document.getElementById("ctl00_mainContent_reload_ctl03_chkList_0").click();
        document.getElementById("ctl00_mainContent_reload_ctl04_chkList_0").click();

        document.getElementById("ctl00_mainContent_btSendFeedback").click();
    }
    document.addEventListener('keydown', function(event) {
        // console.log(event.keyCode);
        if (event.keyCode === 13) {
            action();
        }
    });
})();