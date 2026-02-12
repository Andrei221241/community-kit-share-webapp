// MAIN APPLICATION CONTROLLER
// Responsible for bootstrapping the app and initialising core layers

const App = {

  // Basic app configuration (used for logging + environment control)
  config: {
    appName: "community-kit-share-webapp",
    sprint: 3,
    debug: true
  },

  // Entry point of the entire application
  init() {
    Logger.log("Application starting...");
    this.logStartup();

    DataStore.load();   // NEW: Load persisted state

    UI.init();          // Hand control over to UI layer
  },

  // Logs startup information if debug mode is enabled
  logStartup() {
    Logger.log(`Sprint ${this.config.sprint} initialised`);
  }
};



// LOGGER UTILITY
// Centralised logging so we can control debug output properly

const Logger = {
  log(message) {
    if (App.config.debug) {
      console.log(`[${App.config.appName}] ${message}`);
    }
  }
};



// DATA STORE MODULE
// Responsible for managing application state and persistence

const DataStore = {

  storageKey: "community-kit-share-data",

  state: {
    users: [],
    kits: [],
    requests: [],
    currentUser: null
  },

  // Load state from localStorage
  load() {
    const saved = localStorage.getItem(this.storageKey);

    if (saved) {
      this.state = JSON.parse(saved);
      Logger.log("DataStore loaded from localStorage");
    } else {
      Logger.log("No existing data found, using default state");
    }
  },

  // Save state to localStorage
  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    Logger.log("DataStore saved to localStorage");
  }
};



// UI LAYER
// Handles DOM interaction only (no business logic here)

const UI = {

  init() {
    Logger.log("UI layer initialised");

    this.page = this.detectPage();
    this.bindButtons();
    this.bindForms();
    this.loadPageController();
  },

  detectPage() {
    const page = document.body.dataset.page || "unknown";
    Logger.log(`Detected page: ${page}`);
    return page;
  },

  loadPageController() {
    if (Pages[this.page]) {
      Logger.log(`Loading controller for page: ${this.page}`);
      Pages[this.page].init();
    } else {
      Logger.log("No specific page controller found.");
    }
  },

  bindButtons() {
    const buttons = document.querySelectorAll("[data-action]");
    if (!buttons.length) return;

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        const action = button.dataset.action;

        Logger.log(`Button clicked: ${action}`);
        this.handleAction(action);
      });
    });
  },

  handleAction(action) {
    const actions = {
      login: () => Logger.log("Login action triggered"),
      approve: () => Logger.log("Approve action triggered"),
      requestKit: () => Logger.log("Request Kit action triggered")
    };

    if (actions[action]) {
      actions[action]();
    } else {
      console.warn(`No handler defined for action: ${action}`);
    }
  },

  bindForms() {
    const forms = document.querySelectorAll("form[data-form]");
    if (!forms.length) return;

    forms.forEach(form => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formType = form.dataset.form;
        const data = this.collectFormData(form);

        const errors = Validator.validate(data, formType);

        if (errors.length) {
          this.showFeedback(form, errors.join(", "), "error");
          return;
        }

        this.showFeedback(form, "Form validated successfully", "success");

        Logger.log(`Form submitted: ${formType}`);
        console.log({ form: formType, payload: data });
      });
    });
  },

  collectFormData(form) {
    const fields = form.querySelectorAll("[data-field]");
    const data = {};

    fields.forEach(field => {
      data[field.dataset.field] = field.value.trim();
    });

    return data;
  },

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



// VALIDATION MODULE

const Validator = {

  validate(data, formType) {
    const errors = [];

    Object.entries(data).forEach(([key, value]) => {
      if (!value) {
        errors.push(`${key} is required`);
      }
    });

    if (formType === "login") {

      if (data.email && !data.email.includes("@")) {
        errors.push("Invalid email format");
      }

      if (data.password && data.password.length < 6) {
        errors.push("Password must be at least 6 characters");
      }
    }

    return errors;
  }
};



// PAGE-SPECIFIC CONTROLLERS

const Pages = {

  memberLogin: {
    init() {
      Logger.log("Member Login page controller initialised");
    }
  },

  coordinatorApprove: {
    init() {
      Logger.log("Coordinator Approval page controller initialised");
    }
  },

  memberDashboard: {
    init() {
      Logger.log("Member Dashboard controller initialised");
    }
  }
};



// APPLICATION STARTUP

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
