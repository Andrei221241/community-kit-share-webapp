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

  
  detectPage() {
    const page = document.body.dataset.page || "unknown";
    console.log(`Current page context: ${page}`);
    return page;
  },

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

        console.log({
          type: "form",
          form: form.dataset.form,
          page: this.page,
          payload: data
        });
      });
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
