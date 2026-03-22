// Main application controller
// Responsible for app startup and handing control to the UI layer
const App = {

  // Basic app configuration (useful for debugging and logging)
  config: {
    appName: "community-kit-share-webapp",
    sprint: 2,
    debug: true
  },

  // Entry point for the application
  init() {
    this.logStartup();   // Log app startup info
    UI.init();           // Initialise UI behaviour
  },

  // Logs startup details if debug mode is enabled
  logStartup() {
    if (this.config.debug) {
      console.log(
        `[${this.config.appName}] Sprint ${this.config.sprint} initialised`
      );
    }
  }
};

// UI layer
// Handles user interaction and DOM-related logic only
const UI = {

  // Called once when the app starts
  init() {
    console.log("UI layer initialised (Sprint 2)");
    this.page = this.detectPage(); // Work out which page is currently loaded
    this.bindButtons();            // Set up button click listeners
    this.bindForms();              // Set up form submit handling
  },

  // Detects the current page using a data attribute on <body>
  // Allows the same JS file to behave differently per page later on
  detectPage() {
    const page = document.body.dataset.page || "unknown";
    console.log(`Current page context: ${page}`);
    return page;
  },

  // Finds all buttons with a data-action attribute
  // Attaches click listeners in a generic, reusable way
  bindButtons() {
    const buttons = document.querySelectorAll("[data-action]");
    if (!buttons.length) return; // Exit safely if no buttons exist

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        const action = button.dataset.action;

        // Log the interaction for now (real behaviour added in later sprints)
        console.log({
          type: "button",
          action,
          page: this.page
        });
      });
    });
  },

  // Finds all forms marked with data-form
  // Handles submission without reloading the page
  bindForms() {
    const forms = document.querySelectorAll("form[data-form]");
    if (!forms.length) return; // Exit if no forms on the page

    forms.forEach(form => {
      form.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent default browser submission

        const fields = form.querySelectorAll("[data-field]");
        const data = {};

        // Collect input values into a clean object
        fields.forEach(field => {
          data[field.dataset.field] = field.value.trim();
        });

        // Validate form input before continuing
        const errors = this.validateFormData(data);

        if (errors.length) {
          // Show error message if validation fails
          this.showFeedback(form, errors.join(", "), "error");
          return;
        }

        // Show success message if validation passes
        this.showFeedback(form, "Form submitted successfully", "success");

        // Log structured form submission data
        console.log({
          type: "form",
          form: form.dataset.form,
          page: this.page,
          payload: data
        });
      });
    });
  },

  // Simple client-side validation
  // Checks that all fields contain a value
  validateFormData(data) {
    const errors = [];

    Object.entries(data).forEach(([key, value]) => {
      if (!value) {
        errors.push(`${key} is required`);
      }
    });

    return errors;
  },

  // Displays feedback messages to the user
  // Reuses the same feedback element if it already exists
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

// Wait until the DOM is fully loaded before starting the app
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
