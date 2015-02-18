const React = require('react');

let Loader = React.createClass({

  render: function() {
    let hidden = this.props.loading ? 'loader' : 'loader hidden';

    return (
      <div className={hidden}>
          <span><i className="fa fa-spinner fa-spin fa-2x"></i></span>
      </div>

    )
  }

});

module.exports = Loader;
