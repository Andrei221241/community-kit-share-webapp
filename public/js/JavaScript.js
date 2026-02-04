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
  }
};

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
