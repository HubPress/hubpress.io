import HpConstants from '../constants/HpConstants';
const Dispatcher = require('flux').Dispatcher;
const assign  = require('object-assign');

const PayloadSources = HpConstants.PayloadSources;

let HpDispatcher = assign(new Dispatcher(), {

  handleViewAction: function(action) {
    let payload = {
      source: PayloadSources.VIEW_ACTION,
      action: action
    };
    this.dispatch(payload);
  }

});

module.exports = HpDispatcher;
