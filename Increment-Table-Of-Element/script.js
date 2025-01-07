// script.js
function showTab(tabId, button) {
    // Remove the active class from all buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Remove the active class from all tab panes
    const panes = document.querySelectorAll('.tab-pane');
    panes.forEach(pane => pane.classList.remove('active'));

    // Add the active class to the clicked button
    button.classList.add('active');

    // Add the active class to the corresponding tab pane
    const activePane = document.getElementById(tabId);
    activePane.classList.add('active');
}
