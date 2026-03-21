// ===============================
// MAIN APP
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  bindMemberLogin();
  bindAdminLogin();
  bindBookingForm();
  bindApproveButtons();
});


// ===============================
// MEMBER LOGIN
// ===============================

function bindMemberLogin() {
  const form = document.getElementById("memberLoginForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("memberName").value.trim();
    const id = document.getElementById("memberId").value.trim();

    if (!name || !id) {
      alert("Please fill all fields");
      return;
    }

    // 🔥 Redirect to booking page
    window.location.href = "/member/book";
  });
}


// ===============================
// ADMIN LOGIN
// ===============================

function bindAdminLogin() {
  const form = document.getElementById("adminLoginForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("staffName").value.trim();
    const id = document.getElementById("staffId").value.trim();

    if (!name || !id) {
      alert("Please fill all fields");
      return;
    }

    // 🔥 Redirect to approve page
    window.location.href = "/coordinator/approve";
  });
}


// ===============================
// BOOKING FORM
// ===============================

function bindBookingForm() {
  const form = document.getElementById("gearBookingForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const missionType = document.getElementById("missionType").value;
    const pickupDate = document.getElementById("pickupDate").value;

    if (!missionType || !pickupDate) {
      alert("Please complete required fields");
      return;
    }

    // 🔥 Redirect to confirmation
    window.location.href = "/member/confirmation";
  });
}


// ===============================
// APPROVE / REJECT BUTTONS
// ===============================

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