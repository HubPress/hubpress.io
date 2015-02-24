const gh = require("github");

class Github {

  constructor() {
    this.context=null;
    this.ghInstance=null;
  }

  getContext() {
    return this.context;
  }

  setContext(context) {
    this.context = context;
  }

  getGithub() {
    return this.ghInstance;
  }

  renewInstance(options) {
    this.ghInstance = new gh(options);
    return this.ghInstance;
  }
}

export default new Github();
