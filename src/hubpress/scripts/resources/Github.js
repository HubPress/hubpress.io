const gh = require("github");

let _ghInstance;
let _context;

const Github = {

  getContext: () => _context,

  setContext: context => _context = context,

  getGithub: () => _ghInstance,

  renewInstance: (options) => {
    _ghInstance = new gh(options);
    return _ghInstance;
  }

}

export default Github;
