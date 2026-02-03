const App = {

  config: {
    appName: "community-kit-share-webapp",
    sprint: 1,
    debug: true
  },

  init() {
    this.logStartup();
    this.registerPlaceholders();
  },

  logStartup() {
    if (this.config.debug) {
      console.log(
        `[${this.config.appName}] Sprint ${this.config.sprint} initialised`
      );
    }
  },

  registerPlaceholders() {
    console.log("UI interaction placeholders registered");
    console.log("Feature logic scheduled for Sprint-2");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});