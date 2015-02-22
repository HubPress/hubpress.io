const React = require('react');
const asciidoctor = require('../utils/asciidoctor');


function convertContent(content) {
  return asciidoctor.convert(content);
}

function applyScript() {
  let element = document.getElementById("asciidoc-render");
  let scripts = element.getElementsByTagName("script");
  let addedScripts = [];
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src != "" && addedScripts.indexOf(scripts[i].src) === -1) {
      let tag = document.createElement("script");
      tag.src = scripts[i].src;
      addedScripts.push(tag.src)
      document.getElementsByTagName("head")[0].appendChild(tag);
    }
    else {
      eval(scripts[i].innerHTML);
    }
  }

  if (window.instgrm)
    window.instgrm.Embeds.process();

  this.props.onChange && this.props.onChange(this.convertedPost);
}

let AsciidocRender = React.createClass({

  componentDidMount: function() {
    this.convertedPost = {};
    applyScript.bind(this)();
  },

  componentDidUpdate: function(prevProps, prevState) {
    // Update component only if necessary
    if (prevProps.content && prevProps.content != this.props.content) {
      applyScript.bind(this)();
    }
  },

  render: function() {
    this.convertedPost = convertContent(this.props.content || '');
    let htmlContent = this.convertedPost.html;
    let title = this.convertedPost.attributes && this.convertedPost.attributes.map['doctitle'];
    let tags = this.convertedPost.attributes.map['hp-tags'] || this.props.content && 'No tag';
    let tagsComponent = '';

    if (tags) {
      tagsComponent = (<p><i className="fa fa-tags"></i> {tags}</p>);
    }

    return (
      <div id="asciidoc-render" className="asciidoc-render">
        <h1>{title}</h1>
        {tagsComponent}
        <div ref="content"  dangerouslySetInnerHTML={{__html: htmlContent}}>
        </div>
      </div>
    );
  }

});

module.exports = AsciidocRender;
