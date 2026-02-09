const App = {

  config: {
    appName: "community-kit-share-webapp",
    sprint: 2,
    debug: true
  },

  init() {
    this.logStartup();
    UI.init();
  },

  logStartup() {
    if (this.config.debug) {
      console.log(
        `[${this.config.appName}] Sprint ${this.config.sprint} initialised`
      );
    }
  }
};

const UI = {

  init() {
    console.log("UI layer initialised (Sprint 2)");
    this.page = this.detectPage();
    this.bindButtons();
    this.bindForms();
  },

  // Detect which page we are currently on
  detectPage() {
    const page = document.body.dataset.page || "unknown";
    console.log(`Current page context: ${page}`);
    return page;
  },

  // Attach click listeners to buttons
  bindButtons() {
    const buttons = document.querySelectorAll("[data-action]");
    if (!buttons.length) return;

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        const action = button.dataset.action;

        console.log({
          type: "button",
          action,
          page: this.page
        });
      });
    });
  },

  // Attach submit listeners to forms
  bindForms() {
    const forms = document.querySelectorAll("form[data-form]");
    if (!forms.length) return;

    forms.forEach(form => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const fields = form.querySelectorAll("[data-field]");
        const data = {};

        fields.forEach(field => {
          data[field.dataset.field] = field.value.trim();
        });

        const errors = this.validateFormData(data);

        if (errors.length) {
          this.showFeedback(form, errors.join(", "), "error");
          return;
        }

        this.showFeedback(form, "Form submitted successfully", "success");

        console.log({
          type: "form",
          form: form.dataset.form,
          page: this.page,
          payload: data
        });
      });
    });
  },

  // Validate form data before submission
  validateFormData(data) {
    const errors = [];

    Object.entries(data).forEach(([key, value]) => {
      if (!value) {
        errors.push(`${key} is required`);
      }
    });

    return errors;
  },

  // Display success or error messages to the user
  showFeedback(form, message, type = "info") {
    let feedback = form.querySelector(".form-feedback");

    if (!feedback) {
      feedback = document.createElement("div");
      feedback.className = "form-feedback";
      form.appendChild(feedback);
    }

    feedback.textContent = message;
    feedback.style.marginTop = "10px";
    feedback.style.fontWeight = "bold";
    feedback.style.color = type === "error" ? "red" : "green";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
