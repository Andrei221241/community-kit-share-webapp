// MAIN APPLICATION CONTROLLER
// Responsible for bootstrapping the app and initialising core layers

const App = {

  config: {
    appName: "community-kit-share-webapp",
    sprint: 3,
    debug: true
  },

  init() {
    Logger.log("Application starting...");
    this.logStartup();

    DataStore.load();
    UI.init();
  },

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

  load() {
    const saved = localStorage.getItem(this.storageKey);

    if (saved) {
      this.state = JSON.parse(saved);
      Logger.log("DataStore loaded from localStorage");
    } else {
      Logger.log("No existing data found, using default state");
    }
  },

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    Logger.log("DataStore saved to localStorage");
  }
};


// SERVICE LAYER
// Structured so we can later replace this with real API calls

const AuthService = {

  async login(credentials) {

    await new Promise(res => setTimeout(res, 300));

    return {
      id: Date.now(),
      email: credentials.email
    };
  }
};

const RequestService = {

  async createRequest(data) {

    await new Promise(res => setTimeout(res, 300));

    return {
      id: Date.now(),
      ...data,
      status: "pending"
    };
  }
};


// CONTROLLER LAYER
// Handles business logic separate from UI

const Controller = {

  async login(credentials) {

    const user = await AuthService.login(credentials);

    DataStore.state.currentUser = user;
    DataStore.save();

    Logger.log("User logged in");

    window.location.href = "/member/book";
  },

  async requestKit(requestData) {

    const newRequest = await RequestService.createRequest(requestData);

    DataStore.state.requests.push(newRequest);
    DataStore.save();

    Logger.log("New kit request stored");

    window.location.href = "/member/confirmation";
  },

  approveRequest(id) {

    const request = DataStore.state.requests.find(r => r.id == id);

    if (request) {
      request.status = "approved";
      DataStore.save();
      Logger.log("Request approved");
    }
  },

  rejectRequest(id) {

    const request = DataStore.state.requests.find(r => r.id == id);

    if (request) {
      request.status = "rejected";
      DataStore.save();
      Logger.log("Request rejected");
    }
  }

};


// UI LAYER
// Handles DOM interaction only (no business logic here)

const UI = {

  init() {
    Logger.log("UI layer initialised");

    this.page = this.detectPage();
    this.bindForms();
    this.bindButtons();
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

  bindForms() {
    const forms = document.querySelectorAll("form[data-form]");
    if (!forms.length) return;

    forms.forEach(form => {
      form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const formType = form.dataset.form;
        const data = this.collectFormData(form);

        const errors = Validator.validate(data, formType);

        if (errors.length) {
          this.showFeedback(form, errors.join(", "), "error");
          return;
        }

        if (formType === "login") {
          await Controller.login(data);
        }

        if (formType === "requestKit") {
          await Controller.requestKit(data);
        }

      });
    });
  },

  bindButtons() {

    document.addEventListener("click", (e) => {

      const button = e.target.closest("[data-action]");
      if (!button) return;

      const action = button.dataset.action;
      const id = button.dataset.id;

      if (action === "approve") {
        Controller.approveRequest(id);
        location.reload();
      }

      if (action === "reject") {
        Controller.rejectRequest(id);
        location.reload();
      }

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

    if (formType === "requestKit") {

      if (!data.kitType) {
        errors.push("Please select a kit type");
      }

      if (!data.quantity || parseInt(data.quantity) <= 0) {
        errors.push("Quantity must be at least 1");
      }
    }

    return errors;
  }
};


// PAGE-SPECIFIC CONTROLLERS

const Pages = {

  memberLogin: {
    init() {
      Logger.log("Member Login page initialised");
    }
  },

  memberBook: {
    init() {

      Logger.log("Member Book page initialised");

      if (DataStore.state.currentUser) {
        const soldierInfo = document.getElementById("soldierInfo");
        if (soldierInfo) {
          soldierInfo.textContent =
            "Signed in: " + DataStore.state.currentUser.email;
        }
      }
    }
  },

  coordinatorApprove: {

    init() {

      Logger.log("Coordinator Approve page initialised");
      this.renderRequests();
    },

    renderRequests() {

      const tbody = document.getElementById("requestsTableBody");
      if (!tbody) return;

      tbody.innerHTML = "";

      const requests = DataStore.state.requests;

      if (!requests.length) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6">No requests found.</td>
          </tr>
        `;
        return;
      }

      requests.forEach(request => {

        const row = document.createElement("tr");

        row.innerHTML = `
          <td>REQ-${request.id}</td>
          <td>${request.missionType}</td>
          <td>${request.kitType} (Qty: ${request.quantity})</td>
          <td>${request.pickupDate}</td>
          <td>${request.status}</td>
          <td>
            <button data-action="approve" data-id="${request.id}">
              Approve
            </button>
            <button data-action="reject" data-id="${request.id}">
              Reject
            </button>
          </td>
        `;

        tbody.appendChild(row);
      });
    }
  }

};


// APPLICATION STARTUP

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
