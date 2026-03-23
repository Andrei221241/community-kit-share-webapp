// Wait for the full HTML page to load before running any JavaScript
document.addEventListener("DOMContentLoaded", () => {
    // Initialise the approve/reject button listeners
    bindApproveButtons();
});

// Sets up click listeners for approve and reject buttons
// Used on the coordinator pending requests page
function bindApproveButtons() {
    // Listen for any click anywhere on the page
    document.addEventListener("click", function (e) {

        // If the clicked element has the class "btn-approve", show approval message
        if (e.target.classList.contains("btn-approve")) {
            alert("Request Approved");
        }

        // If the clicked element has the class "btn-reject", show rejection message
        if (e.target.classList.contains("btn-reject")) {
            alert("Request Rejected");
        }

    });
}