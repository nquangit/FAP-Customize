// ==UserScript==
// @name         FAP timetable
// @namespace    http://tampermonkey.net/
// @version      2024-05-02
// @description  FAP timetable
// @author       You
// @match        https://fap.fpt.edu.vn/Report/ScheduleOfWeek.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.vn
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function get_timetable_element() {
        // Get the div element with the specified ID
        var divContent = document.getElementById('ctl00_mainContent_divContent');

        // Check if the div element exists
        if (divContent) {
            // Find the next sibling element of the div
            var nextSibling = divContent.nextElementSibling;

            // Check if the next sibling element exists and if it is a table
            if (nextSibling && nextSibling.tagName.toLowerCase() === 'table') {
                // You have successfully found the table next to the div
                // console.log("Table found:", nextSibling);
                return nextSibling;
            } else {
                return null;
            }
        }
        return null;
    }

    function get_all_lesson(table_element) {
        // Get all td elements within the table
        var tds = table_element.getElementsByTagName('td');

        // Array to store selected td elements
        var selectedTds = [];

        // Loop through each td element
        for (var i = 0; i < tds.length; i++) {
            // Get the p element within the td
            var pElement = tds[i].querySelector('p');
            // Check if pElement exists and if it contains a link
            if (pElement && pElement.querySelector('a')) {
                // Add the td to the selectedTds array
                selectedTds.push(tds[i]);
            }
        }
        // console.log(selectedTds);
        return selectedTds;
    }

    function mark_attandance(lesson, status) {
        var attendance_color = {
            "Not yet": "#ffe2c0",
            "attended": "#dcf5e3",
            "absent": "rgba(255, 23, 68, .8)"
        };
        console.log(status);
        return attendance_color[status];
    }

    function edit(lessons) {
        for (var i = 0; i < lessons.length; i++) {
            // Change the content of the <td> element to "A"
            // console.log(lessons[i]);
            // Extract information from the <td> element
            var aElements = lessons[i].getElementsByTagName('a');
            var activity_link = aElements[0];
            // Change the text on activity link
            var activity_name = activity_link.textContent.split('-')[0];
            var material_link = aElements[1];
            var classroom = lessons[i].textContent.trim().split('at ')[1].split(' ')[0];
            var meetUrl = aElements[2];
            var eduNextUrl = aElements[4];
            var status = lessons[i].querySelector('font').textContent.trim();
            var time = lessons[i].querySelector('.label-success').textContent.trim();

            // Display extracted information
            // console.log("Activity link:", activity_link);
            // console.log("Material link:", material_link);
            // console.log("Classroom:", classroom);
            // console.log("Meet URL:", meetUrl);
            // console.log("EduNext URL:", eduNextUrl);
            // console.log("Status:", status);
            // console.log("Time:", time);

            // Remove padding
            lessons[i].style.padding = "2px";

            // Fill background color


            // Change the structure
            var lessonDetailsHTML = `
                <div class="lesson-container" style="background: ${mark_attandance(lessons[i], status)};">
                    <p class="activity-link">${activity_name}</p>
                    <p class="class-room label label-danger">${classroom}</p>
                    <p class="lesson-time label label-success">${time}</p>
                    <a href="${material_link}" class="material-link label label-primary">Material</a>
                    <a href="${meetUrl}" class="meet-link label label-info">GGMeet</a>
            `;
            // Check if edunext link available
            if (eduNextUrl) {
                lessonDetailsHTML += `<a href="${eduNextUrl}" class="edunext-link label label-warning">EduNext</a>`;
            }
            lessonDetailsHTML += `</div>`;

            // Click the lesson to go the the activity link
            lessons[i].addEventListener('click', function() {
                // Navigate to a URL when the lesson-container is clicked
                window.location.href = activity_link.getAttribute('href');
            });

            lessons[i].innerHTML = lessonDetailsHTML;
        }
        // Create a <style> element
            var styleElement = document.createElement('style');

        // Define your CSS code
        var cssCode = `
                .container {
	                width: 85%;
                }

                /* Style for the table */
                table {
                  border-collapse: collapse;
                  width: 100%;
                }

                /* Style for table header */
                thead th {
                  background-color: #f2f2f2;
                  border: 1px solid #ddd;
                  padding: 8px;
                  text-align: center;
                }

                /* Style for table cells */
                td {
                  border: 1px solid #ddd;
                  padding: 8px;
                }

                /* Style for select dropdowns */
                select {
                  padding: 5px;
                  font-size: 16px;
                  border-radius: 5px;
                }

                /* Style for selected option in dropdown */
                option:checked {
                  font-weight: bold;
                }

                /* Style for odd rows */
                tbody tr:nth-child(odd) {
                  background-color: #f9f9f9;
                }

                /* Style for links */
                a {
                  color: #007bff;
                  text-decoration: none;
                }

                a:hover {
                  text-decoration: underline;
                }

                /* Style for labels */
                .label {
                  padding: 3px 6px;
                  border-radius: 3px;
                  font-size: 12px;
                }

                /* Style for warning label */
                .label-warning {
                  background-color: #ffc107;
                  color: #212529;
                }

                /* Style for primary label */
                .label-primary {
                  background-color: #007bff;
                  color: #fff;
                }

                /* Style for success label */
                .label-success {
                  background-color: #28a745;
                  color: #fff;
                }

                /* Style for online indicator */
                .online-indicator {
                  display: inline-block;
                  width: 10px;
                  height: 10px;
                  background-color: green;
                  border-radius: 50%;
                }

                /* Style for online text */
                .online-text {
                  display: inline-block;
                  margin-left: 5px;
                  font-size: 14px;
                  color: green;
                }

                .lesson-container {
                    position: relative;
                    padding: 10px 10px 30px 10px;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
                }
                .lesson-container:hover {
                    cursor: pointer;
                    box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.3);
                }
                .lesson-container a {
                    display: block;
                    margin: 5px;
                    width: 50%;
                }
                .activity-link {
                    font-size: 1.2em;
                    font-weight: bold;
                    text-align: center;
                    color: #5c5c5c;
                }
                .lesson-time {
                    position: absolute;
                    bottom: 0px;
                    right: 5px;
                }
                .class-room {
                    position: absolute;
                    right: 5px;
                    top: 5px;
                 }
            `;

        // Set the CSS code as text content of the <style> element
        styleElement.textContent = cssCode;

        // Append the <style> element to the <head> element of the document
        document.head.appendChild(styleElement);
    }

    function main() {
        var timetable_element = get_timetable_element();
        var lessons = get_all_lesson(timetable_element);
        edit(lessons);
    }

    main();
})();