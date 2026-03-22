document.addEventListener("DOMContentLoaded", () => {
    bindApproveButtons();
});

function bindApproveButtons() {
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("btn-approve")) {
            alert("Request Approved");
        }
        if (e.target.classList.contains("btn-reject")) {
            alert("Request Rejected");
        }
    });
}